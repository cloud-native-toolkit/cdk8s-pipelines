/**
 * This file has builders in it for the various pipeline constructs.
 */


import * as fs from 'fs';
import { ApiObject, ApiObjectProps, Yaml } from 'cdk8s';
import { Construct } from 'constructs';
import { invertBuildParameter, usingBuildParameter, usingResultsPath } from './common';
import {
  Pipeline,
  PipelineParam,
  PipelineRun,
  PipelineRunParam,
  PipelineRunWorkspace,
  PipelineTask,
  PipelineTaskWorkspace,
  PipelineWorkspace,
} from './pipelines';
import {
  Task,
  TaskEnvValueSource,
  TaskParam,
  TaskProps,
  TaskSpecParam,
  TaskSpecResult,
  TaskStep,
  TaskStepEnv,
  TaskWorkspace,
  ResolverParam,
  RemoteTaskRef,
  TaskRef,
} from './tasks';

const DefaultPipelineServiceAccountName = 'default:pipeline';

/**
 * Creates the properties for a `ClusterRoleBinding`
 * @param bindingName
 * @param bindingNs
 * @param rolename
 * @param sa
 * @param saNamespace
 */
function createRoleBindingProps(bindingName: string, bindingNs: string, rolename: string, sa: string, saNamespace: string): ApiObjectProps {
  return {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRoleBinding',
    metadata: {
      name: bindingName,
      namespace: bindingNs,
    },
    roleRef: {
      kind: 'ClusterRole',
      name: rolename,
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: sa,
        namespace: saNamespace,
      },
    ],
  };
}

const DefaultClusterRoleBindingProps = createRoleBindingProps(
  'pipeline-admin-default-crb',
  'default',
  'cluster-admin',
  'pipeline',
  'default');

/**
 * Resolves the value through different means.
 */
export interface IValueResolver {
  /**
   * Gets the string value for a parameter
   * @returns string The value.
   */
  get value(): string;
}

export class ConstantStringValueResolver implements IValueResolver {

  private val: string;

  constructor(val: string) {
    this.val = val;
  }

  public get value(): string {
    return this.val;
  }
}

export class PipelineParameterValueResolver implements IValueResolver {

  private val: ParameterBuilder;

  constructor(param: ParameterBuilder) {
    this.val = param;
  }

  get value(): string {
    // TODO: Fix this... needs to return a representation that would be a link
    // to the actual parameter
    //return `$(params.${this.val.logicalID})`
    return usingBuildParameter(this.val.logicalID!);
  }

}

export function constant(val: string) : IValueResolver {
  return new ConstantStringValueResolver(val);
}

export function fromPipelineParam(param: ParameterBuilder): IValueResolver {
  return new PipelineParameterValueResolver(param);
}

/**
 * The options for builders for the `buildXX()` methods.
 */
export interface BuilderOptions {
  /**
   * If true, all the dependent objects are generated with the build. This is
   * designed to run on as minimal cluster as possible, with as few pre steps
   * as possible.
   */
  readonly includeDependencies?: boolean;
}

/**
 * The default options for the builders.
 */
export const DefaultBuilderOptions: BuilderOptions = {
  includeDependencies: false,
};

/**
 * Builds the Workspaces for use by Tasks and Pipelines.
 *
 * @see https://tekton.dev/docs/pipelines/workspaces/
 */
export class WorkspaceBuilder {
  private readonly _logicalID: string;
  private _binding?: string;
  private _description?: string;

  /**
   * Creates the `WorkspaceBuilder`, using the given `id` as the logical ID for
   * the workspace.
   * @param id
   */
  constructor(id: string) {
    this._logicalID = id;
  }

  /**
   * Gets the logical ID of the `Workspace`.
   */
  public get logicalID(): string | undefined {
    return this._logicalID;
  }

  /**
   * Gets the name of the workspace.
   */
  public get name(): string | undefined {
    return this._logicalID;
  }

  /**
   * Gets the description of the workspace.
   */
  public get description(): string {
    return this._description || '';
  }

  /**
   * Gets the binding of task workspace to a pipeline workspace.
   */
  public get binding(): string | undefined {
    return this._binding;
  }

  /**
   * Sets the binding of a task workspace to a pipeline workspace.
   * @param workspace
   */
  public withBinding(workspace: string): WorkspaceBuilder {
    this._binding = workspace;
    return this;
  }

  /**
   * Sets the description of the workspace.
   * @param desc
   */
  public withDescription(desc: string): WorkspaceBuilder {
    this._description = desc;
    return this;
  }

}

/**
 * Builds the parameters for use by Tasks and Pipelines.
 *
 * @see https://tekton.dev/docs/pipelines/pipelines/#specifying-parameters
 */
export class ParameterBuilder {
  private readonly _logicalID: string;
  private _name: string;
  private _description?: string;
  private _type?: string;
  private _value?: IValueResolver;
  private _defaultValue?: string;
  private _requiresPipelineParam: string | undefined;

  constructor(id: string) {
    this._logicalID = id;
    this._name = id;
    this._requiresPipelineParam = undefined;
  }

  /**
   * Gets the logicalID for the `ParameterBuilder`, which is used by the underlying
   * construct.
   */
  public get logicalID(): string | undefined {
    return this._logicalID;
  }

  /**
   * Gets the name of the parameter.
   */
  public get name(): string | undefined {
    return this._name;
  }

  /**
   * Gets the description of the parameter.
   */
  public get description(): string {
    return this._description || '';
  }

  /**
   * @deprecated name is set by logicalID
   * Sets the name of the parameter.
   * @param name
   */
  public withName(name: string): ParameterBuilder {
    this._name = name;
    return this;
  }

  /**
   * Sets the description of the parameter.
   * @param desc
   */
  public withDescription(desc: string): ParameterBuilder {
    this._description = desc;
    return this;
  }

  /**
   * Sets the type of the parameter
   * @param type
   */
  public ofType(type: string): ParameterBuilder {
    this._type = type;
    return this;
  }

  /**
   * Gets the type of the parameter
   */
  public get type(): string | undefined {
    return this._type;
  }

  /**
   * Sets the value for the parameter
   * @param val
   */
  public withValue(val: string | IValueResolver): ParameterBuilder {
    // If you are giving it a value here, then you do not
    // need the Pipeline parameter for this parameter.
    this._requiresPipelineParam = undefined;
    if (typeof(val) === 'string') {
      this._value = constant(val);
    } else {
      if (val instanceof PipelineParameterValueResolver) {
        this._requiresPipelineParam = invertBuildParameter(val.value);
      }
      this._value = val;
    }
    return this;
  }

  /**
   * Gets the value of the parameter
   */
  public get value(): string | undefined {
    return this._value?.value;
  }

  /**
   * Sets the default value for the parameter.
   * @param val
   */
  public withDefaultValue(val: string): ParameterBuilder {
    this._defaultValue = val;
    return this;
  }

  public get defaultValue(): string | undefined {
    return this._defaultValue;
  }

  /**
   * Returns the name of the input if the parameter expects one at the
   * pipeline level, undefined otherwise.
   */
  public get requiresPipelineParameter(): string | undefined {
    return this._requiresPipelineParam;
  }
}

/**
 * Resolves the `script` through different means.
 */
interface ScriptResolver {
  /**
   * Gets the body of the script.
   * @returns string The script.
   */
  scriptData(): string;
}

/**
 * Resolves the provided object into a YAML string.
 */
class ObjScriptResolver implements ScriptResolver {
  readonly _obj: any;

  /**
   * Creates an instance of the `ObjScriptResolver`.
   * @param obj The object to serialize to YAML for the script.
   */
  constructor(obj: any) {
    this._obj = obj;
  }

  /**
   * Gets the body of the script as a YAML representation of the object.
   */
  public scriptData(): string {
    return Yaml.stringify(this._obj);
  }
}

/**
 * Gets the content from the provided URL and returns it as the script data.
 */
class UrlScriptResolver implements ScriptResolver {
  readonly _url: string;

  /**
   * Creates an instance of the `UrlScriptResolver` with the provided URL.
   * @param url
   */
  constructor(url: string) {
    this._url = url;
  }

  /**
   * Gets the body of the script from the provided URL.
   * @return string Script data.
   */
  public scriptData(): string {
    const data = fs.readFileSync(this._url, {
      encoding: 'utf8',
      flag: 'r',
    });

    return data.replace(/\n/g, '\\n');
  }
}

/**
 * Gets the content from the provided URL and returns it as the script data,
 * but prints the output of running the script to the given results.
 */
class UrlScriptToResultsResolver implements ScriptResolver {
  readonly _resolver: ScriptResolver;
  readonly _resultsName: string;

  /**
   * Creates a new instance of the UrlScriptToResultsResolver.
   * @param url The Uniform Resource Locator (URL) of the script.
   * @param resultsName The name of the results into which the script prints output.
   */
  constructor(url: string, resultsName: string) {
    this._resolver = new UrlScriptResolver(url);
    this._resultsName = resultsName;
  }

  /**
   * The body of the script. This will include a `tee <to the results location>`,
   * so make sure the script you use here does not already have it.
   */
  public scriptData(): string {
    return [this._resolver.scriptData(), `tee ${usingResultsPath(this._resultsName)}`].join(' | ');
  }
}

/**
 * Gets the content from the static value provided.
 */
class StaticScriptResolver implements ScriptResolver {
  readonly _script: string;

  /**
   * Creates an instance of the `StaticScriptResolver`.
   * @param data
   */
  constructor(data: string) {
    this._script = data;
  }

  /**
   * Returns the static value provided.
   */
  public scriptData(): string {
    return this._script;
  }
}

/**
 * Creates a `Step` in a `Task`.
 */
export class TaskStepBuilder {
  private _name?: string;
  private _dir?: string;
  private _image?: string;
  private _cmd?: string[];
  private _args?: string[];
  private _env?: TaskStepEnv[];
  private _script?: ScriptResolver;

  /**
   * Creates a new instance of the TaskStepBuilder.
   */
  public constructor() {
  }

  /**
   * The name of the `Step` of the `Task`.
   */
  public get name(): string | undefined {
    return this._name;
  }

  /**
   * The name of the container `image` used to execute the `Step` of the
   * `Task`.
   */
  public get image(): string | undefined {
    return this._image;
  }

  /**
   * The body of the script.
   */
  public get scriptData(): string | undefined {
    return this._script?.scriptData();
  }

  /**
   * Gets the command-line arguments that will be supplied to the `command`.
   */
  public get args(): string[] | undefined {
    return this._args;
  }

  /**
   * Gets the command used for the `Step` on the `Task`.
   */
  public get command(): string[] | undefined {
    return this._cmd;
  }

  /**
   * Gets the working directory of the `Step` of the `Task`.
   *
   * @see https://tekton.dev/docs/pipelines/tasks/#defining-steps
   */
  public get workingDir(): string | undefined {
    return this._dir;
  }

  /**
   * Sets the name of the `Step` of the `Task`.
   *
   * @param name Name of the `Step`
   */
  public withName(name: string): TaskStepBuilder {
    this._name = name;
    return this;
  }

  /**
   * The name of the image to use when executing the `Step` on the `Task`
   * @param img
   */
  public withImage(img: string): TaskStepBuilder {
    this._image = img;
    return this;
  }

  /**
   * The name of the command to use when running the `Step` of the `Task`. If
   * `command` is specified, do not specify `script`.
   * @param cmd
   */
  public withCommand(cmd: string[]): TaskStepBuilder {
    this._cmd = cmd;
    return this;
  }

  /**
   * The args to use with the `command`.
   * @param args
   */
  public withArgs(args: string[]): TaskStepBuilder {
    this._args = args;
    return this;
  }

  /**
   * If supplied, uses the content found at the given URL for the
   * `script` value of the step. Use this as an alternative to "heredoc", which
   * is embedding hard-coded shell or other scripts in the step.
   *
   * If you supply this, do not supply a value for `fromScriptObject`.
   * @param url
   */
  public fromScriptUrl(url: string): TaskStepBuilder {
    this._script = new UrlScriptResolver(url);
    return this;
  }

  /**
   * If supplied, uses the content found at the given URL for the `script` value
   * of the step and writes its output to the `results`. Use this as an
   * alternative to "heredoc", which is embedding hard-coded shell or other
   * scripts in the step.
   *
   * @param url
   * @param resultsName
   */
  public fromScriptUrlToResults(url: string, resultsName: string): TaskStepBuilder {
    this._script = new UrlScriptToResultsResolver(url, resultsName);
    return this;
  }

  /**
   * If supplied, uses the cdk8s `ApiObject` supplied as the body of the
   * `script` for the `Task`. This is most useful when used with `oc apply` or
   * other tasks in which you want to apply the object during the step in the
   * pipeline.
   *
   * If you supply this, do not supply a value for `fromScriptUrl`.
   * @param obj
   */
  public fromScriptObject(obj: any): TaskStepBuilder {
    this._script = new ObjScriptResolver(obj);
    return this;
  }

  /**
   * If supplied, uses the provided script data as-is for the script value.
   *
   * Use this when you have the script data from a source other than a file or
   * an object. Use the other methods, such as `fromScriptUrl` (when the script
   * is in a file) or `scriptFromObject` (when the script is a CDK8s object)
   * rather than resolving those yourself.
   *
   * @param data
   */
  public fromScriptData(data: string): TaskStepBuilder {
    this._script = new StaticScriptResolver(data);
    return this;
  }

  /**
   * The `workingDir` of the `Task`.
   * @param dir
   */
  public withWorkingDir(dir: string): TaskStepBuilder {
    this._dir = dir;
    return this;
  }

  /**
   * Sets the environment variable for the Step.
   *
   * @param name The name of the `env` to add or set.
   * @param valueFrom The source of the value for the variable.
   *
   * @see https://tekton.dev/docs/pipelines/podtemplates/
   * @see valueFrom()
   */
  withEnv(name: string, valueFrom: TaskEnvValueSource): TaskStepBuilder {
    if (!this._env) {
      this._env = new Array<TaskStepEnv>();
    }
    this._env.push({
      name: name,
      valueFrom: valueFrom,
    });
    return this;
  }

  /**
   * When called, builds the `Step`. This will be called the `TaskBuilder`;
   * do not call it directly.
   */
  public buildTaskStep(): TaskStep | undefined {
    if (this._script) {
      return {
        name: this.name,
        image: this.image,
        script: this.scriptData,
        workingDir: this.workingDir,
        env: this._env,
      };
    } else {
      return {
        name: this.name,
        image: this.image,
        command: this.command,
        args: this.args,
        workingDir: this.workingDir,
        env: this._env,
      };
    }
  }
}

export interface IRemoteTaskResolver {
  resolver?: string;
  params?: ResolverParam[];
  /**
   * Gets the taskRef yaml for a remote Task
   * @returns RemoteTaskRef The yaml as an API Object
   */
  get taskRef(): RemoteTaskRef;
}

/**
 * Resolves the provided cluster-scoped task into yaml for the taskRef field.
 */
export class ClusterTaskResolver implements IRemoteTaskResolver {
  resolver?: string;
  params?: ResolverParam[];

  /**
   * Creates an instance of the `ClusterTaskResolver`.
   * @param name The name of the cluster-scoped task.
   * @param namespace The namespace of the cluster-scoped task.
   */
  constructor(name: string, namespace: string) {
    this.resolver = 'cluster';
    this.params = new Array<ResolverParam>();
    this.params.push({
      name: 'name',
      value: name,
    });
    this.params.push({
      name: 'namespace',
      value: namespace,
    });
    this.params.push({
      name: 'kind',
      value: 'task',
    });
  }

  /**
   * Gets the YAML representation of cluster-scoped task.
   */
  get taskRef(): RemoteTaskRef {
    return {
      resolver: this.resolver,
      params: this.params,
    };
  }
}

/**
 * Builds Tekton `Task` objects that are independent of a `Pipeline`.
 *
 * To use a builder for tasks that will be used in a Pipeline, use the
 * `PipelineBuilder` instead.
 */
export class TaskBuilder {

  private readonly _scope: Construct;
  private readonly _id: string;
  private _steps?: TaskStepBuilder[];
  private _name?: string;
  private _description?: string;
  private _taskref?: TaskRef | RemoteTaskRef;
  // These were initially arrays, but converted them to maps so that if
  // multiple values are added that the last one will win.
  private _workspaces = new Map<string, WorkspaceBuilder>;
  private _params = new Map<string, ParameterBuilder>;
  private _results: TaskSpecResult[] = new Array<TaskSpecResult>;
  private _annotations?: {
    [key: string]: string;
  };
  private _labels?: {
    [key: string]: string;
  };
  private _runafter?: string[];

  /**
   * Creates a new instance of the `TaskBuilder` using the given `scope` and
   * `id`.
   * @param scope
   * @param id
   */
  public constructor(scope: Construct, id: string) {
    this._scope = scope;
    this._id = id;
    // These are required, and it's better to just create it rather than
    // check each time.
    this._steps = new Array<TaskStepBuilder>();
  }

  public get logicalID(): string {
    return this._id;
  }

  /**
   * Adds a label to the `Task` with the provided label key and value.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
   *
   * @param key
   * @param value
   */
  public withLabel(key: string, value: string): TaskBuilder {
    if (!this._labels) {
      this._labels = {};
    }
    this._labels[key] = value;
    return this;
  }

  /**
   * Adds an annotation to the `Task` `metadata` with the provided key and value.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/
   *
   * @param key The annotation's key.
   * @param value The annotation's value.
   */
  public withAnnotation(key: string, value: string): TaskBuilder {
    if (!this._annotations) {
      this._annotations = {};
    }
    this._annotations[key] = value;
    return this;
  }

  /**
   * Gets the name of the `Task` in the context of a pipeline.
   * If not set, the 'Task' id is used.
   */
  public get name(): string {
    return this._name || this._id;
  }

  /**
   * Sets the name of the `Task` to be used within a pipeline.
   * @param name
   */
  public withName(name: string): TaskBuilder {
    this._name = name;
    return this;
  }

  /**
   * Sets the `description` of the `Task` being built.
   * @param description
   */
  public withDescription(description: string): TaskBuilder {
    this._description = description;
    return this;
  }

  /**
   * Gets the `description` of the `Task`.
   */
  public get description(): string | undefined {
    return this._description;
  }

  /**
   * Adds the specified workspace to the `Task`.
   * @param workspace
   */
  public withWorkspace(workspace: WorkspaceBuilder): TaskBuilder {
    this._workspaces.set(workspace.logicalID!, workspace);
    return this;
  }

  /**
   * Gets the workspaces for the `Task`.
   */
  public get workspaces(): WorkspaceBuilder[] | undefined {
    return Array.from(this._workspaces?.values());
  }

  /**
   * Adds a parameter of type string to the `Task`.
   *
   * @param param
   */
  public withStringParam(param: ParameterBuilder): TaskBuilder {
    this._params.set(param.logicalID!, param.ofType('string'));
    return this;
  }

  public get parameters(): ParameterBuilder[] | undefined {
    return Array.from(this._params?.values());
  }

  /**
   * Allows you to add a result to the Task.
   *
   * @see https://tekton.dev/docs/pipelines/tasks/#emitting-results
   *
   * @param name The name of the result.
   * @param description The result's description.
   */
  public withResult(name: string, description: string): TaskBuilder {
    // First, check to see if there is already a result with this name
    const existing = this._results.find((obj) => obj.name === name);
    if (existing) {
      throw new Error(`Cannot add result ${name}, as it already exists.`);
    }
    this._results.push({
      name: name,
      description: description,
    });
    return this;
  }

  /**
   * Adds the given `step` (`TaskStepBuilder`) to the `Task`.
   * @param step
   */
  public withStep(step: TaskStepBuilder): TaskBuilder {
    this._steps!.push(step);
    return this;
  }

  /**
   * Allows you to specify the names of which task(s), if any, the 'Task' should
   * run after in a pipeline. An empty array as input indicates the 'Task' yaml
   * should have no runAfter field.
   * By default, the value of runAfter is set to the preceeding 'Task' in the pipeline.
   * @param taskArray
   */
  public specifyRunAfter(taskArray: string[]): TaskBuilder {
    this._runafter = taskArray;
    return this;
  }

  /**
   * Gets the list of task names for the runAfter value of the `Task`.
   */
  public get runAfter(): string[] | undefined {
    return this._runafter;
  }

  /**
   * TODO
   * @param task TODO
   */
  public referencingTask(task: string | IRemoteTaskResolver): TaskBuilder {
    if (typeof(task) == 'string') {
      this._taskref = { name: task };
    } else {
      this._taskref = task.taskRef;
    }
    return this;
  }

  /**
   * TODO
   */
  public get taskRef(): TaskRef | RemoteTaskRef {
    return this._taskref || { name: this._id };
  }

  /**
   * Builds the `Task`.
   */
  public buildTask(): void {

    const taskSteps = new Array<TaskStep>();

    this._steps?.forEach((s) => {
      const step = s.buildTaskStep();
      if (step) {
        taskSteps.push(step);
      }
    });

    const taskParams = new Array<TaskSpecParam>();
    this._params?.forEach((p) => {
      taskParams.push({
        name: p.logicalID,
        description: p.description,
        default: p.defaultValue || '',
      });
    });

    const taskWorkspaces = new Array<TaskWorkspace>();
    this._workspaces?.forEach((ws) => {
      taskWorkspaces.push({
        name: ws.logicalID,
        description: ws.description,
      });
    });

    // Note: buildTask called for this TaskBuilder object only if this.taskRef is a TaskRef
    const taskName = ('name' in this.taskRef) ? this.taskRef.name : this.logicalID;

    const props: TaskProps = {
      metadata: {
        name: taskName,
        labels: this._labels,
        annotations: this._annotations,
      },
      spec: {
        description: this.description,
        workspaces: taskWorkspaces,
        params: taskParams,
        steps: taskSteps,
        results: this._results,
      },
    };

    new Task(this._scope!, this._id!, props);

  }
}

/**
 *
 */
export class PipelineBuilder {
  private readonly _scope: Construct;
  private readonly _id: string;
  private _name: string;
  private _description?: string;
  private _tasks?: TaskBuilder[];
  private _params?: Map<string, ParameterBuilder>;

  /**
   * Creates a new instance of the `PipelineBuilder` using the given `scope` and
   * `id`. `id` also sets the pipeline's name.
   * @param scope
   * @param id
   */
  public constructor(scope: Construct, id: string) {
    this._scope = scope;
    this._id = id;
    this._name = id;
  }

  /**
   * @deprecated pipeline name is set by `id`
   * Provides the name for the pipeline task and will be
   * rendered as the `name` property.
   * @param name
   */
  public withName(name: string): PipelineBuilder {
    this._name = name;
    return this;
  }

  /**
   * Gets the name of the pipeline
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Provides the description for the pipeline.
   * @param description
   */
  public withDescription(description: string): PipelineBuilder {
    this._description = description;
    return this;
  }

  // Adds the task to the pipeline.
  public withTask(taskB: TaskBuilder): PipelineBuilder {
    // Add the task to the list of tasks...
    if (!this._tasks) {
      this._tasks = new Array<TaskBuilder>();
    }
    this._tasks.push(taskB);
    return this;
  }

  /**
   * Add parameter of type string to the Pipeline
   * @param param
   */
  public withStringParam(param: ParameterBuilder): PipelineBuilder {
    if (!this._params) {
      this._params = new Map<string, ParameterBuilder>();
    }
    this._params.set(param.logicalID!, param.ofType('string'));
    return this;
  }

  /**
   * Returns the array of `PipelineParam` objects that represent the parameters
   * configured for the `Pipeline`.
   *
   * Note this is an "expensive" get because it loops through the tasks in the
   * pipeline and checks for duplicates in the pipeline parameters for each task
   * parameter found. You should avoid calling this in a loop--instead, declare
   * a local variable before the loop and reference that instead.
   *
   * @returns PipelineParam[] An array of the pipeline parameters.
   */
  public get params(): PipelineParam[] {
    // Not trying to prematurely optimize here, but this could be an expensive
    // operation, so we only need to do it if the state of the object has not
    // changed.
    const pipelineParams = new Map<string, PipelineParam>();
    // First, add all the user-supplied pipeline-level parameters
    this._params?.forEach((par) => {
      pipelineParams.set(par.logicalID!, {
        name: par.logicalID,
        type: par.type,
        default: par.defaultValue || '',
      });
    });
    // Then, check if any Tasks require a missing pipeline-level parameter
    this._tasks?.forEach((t) => {
      t.parameters?.forEach(p => {
        if (p.requiresPipelineParameter) {
          const requiredPipelineParam = p.requiresPipelineParameter;
          const pp = pipelineParams.has(requiredPipelineParam);
          if (!pp) {
            throw new Error(`Parameter '${p.logicalID}' in Task '${t.name}' expects Pipeline value from parameter '${requiredPipelineParam}', which is not defined.`);
          }
        }
      });
    });
    return Array.from(pipelineParams.values());
  }

  /**
   * Returns the array of `PipelineWorkspace` objects that represent the workspaces
   * configured for the `Pipeline`.
   *
   * This is an "expensive" get because it loops through the workspaces in the
   * pipeline and checks for duplicates in the pipeline workspaces for each task
   * workspace found. You should avoid calling this in a loop--instead, declare
   * a local variable before the loop and reference that instead.
   *
   * @returns PipelineWorkspace[] An array of the pipeline workspaces.
   */
  public get workspaces(): PipelineWorkspace[] {
    const pipelineWorkspaces = new Map<string, PipelineWorkspace>();
    this._tasks?.forEach((t) => {
      t.workspaces?.forEach((w) => {
        if (w.binding) {
        // Only add the workspace on the pipeline level if it is not already
        // there...
          const ws = pipelineWorkspaces.get(w.binding);
          if (!ws) {
            pipelineWorkspaces.set(w.binding, {
              name: w.binding,
              description: w.description,
            });
          }
        } else {
          throw new Error(`Workspace '${w.logicalID}' in Task '${t.name}' has no binding to a workspace in Pipeline '${this.name}'.`);
        }
      });
    });
    return Array.from(pipelineWorkspaces.values());
  }

  /**
   * Builds the actual [Pipeline](https://tekton.dev/docs/getting-started/pipelines/)
   * from the settings configured using the fluid syntax.
   */
  public buildPipeline(opts: BuilderOptions = DefaultBuilderOptions): void {
    // TODO: validate the object

    const pipelineTasks: PipelineTask[] = new Array<PipelineTask>();
    // For making a list to make sure that tasks aren't duplicated when doing
    // the build. Not that it really hurts anything, but it makes the multidoc
    // YAML file bigger and more complex than it needs to be.
    const taskList: string[] = new Array<string>();
    // To ensure that all tasks in the pipeline have unique names.
    const taskNames: string[] = new Array<string>();

    this._tasks?.forEach((t, i) => {

      const taskName = t.name;
      if (taskNames.find(it => {
        return it == taskName;
      })) {
        throw new Error(`Multiple tasks found with name '${taskName}' in Pipeline '${this.name}', but task names must be unique.`);
      }
      taskNames.push(taskName);

      const taskParams: TaskParam[] = new Array<TaskParam>();
      const taskWorkspaces: PipelineTaskWorkspace[] = new Array<TaskWorkspace>();

      t.parameters?.forEach(p => {
        taskParams.push({
          name: p.logicalID,
          value: p.value,
        });
      });

      t.workspaces?.forEach((w) => {
        taskWorkspaces.push({
          name: w.logicalID,
          workspace: w.binding,
        });
      });

      const after = [];
      if (t.runAfter != undefined) {
        t.runAfter.forEach(name => {
          if (!this._tasks?.find(it => {return (it.name) == name;})) {
            throw new Error(`'${name}' supplied as value for runAfter but no such task found in pipeline.`);
          }
          after.push(name);
        });
      } else if (i > 0) {
        after.push(this._tasks![i - 1].name);
      }

      const pt = createOrderedPipelineTask(t, after, taskParams, taskWorkspaces);

      pipelineTasks.push(pt);

      if (opts.includeDependencies && 'name' in t.taskRef) {
        // Build the task if the user has asked for the dependencies to be
        // built along with the pipeline, but only if the task does not
        // reference a remote location and we haven't already built the taskRef.
        const buildName = t.taskRef.name!;
        if (!taskList.find(it => {
          return it == buildName;
        })) {
          t.buildTask();
        }
        taskList.push(buildName);
      }
    });

    new Pipeline(this._scope!, this._id!, {
      metadata:
        {
          name: this.name,
        },
      spec: {
        description: this._description,
        params: this.params,
        workspaces: this.workspaces,
        tasks: pipelineTasks,
      },
    });
  }
}

function createOrderedPipelineTask(t: TaskBuilder, after: string[], params: TaskParam[], ws: TaskWorkspace[]): PipelineTask {
  if (after.length) {
    return {
      name: t.name,
      taskRef: t.taskRef,
      runAfter: after,
      params: params,
      workspaces: ws,
    };
  }
  return {
    name: t.name,
    taskRef: t.taskRef,
    params: params,
    workspaces: ws,
  };
}

/**
 * Builds a `PipelineRun` using the supplied configuration.
 *
 * @see https://tekton.dev/docs/pipelines/pipelineruns/
 */
export class PipelineRunBuilder {
  private readonly _scope: Construct;
  private readonly _id: string;
  private readonly _pipeline: PipelineBuilder;
  private readonly _runParams: PipelineRunParam[];
  private readonly _runWorkspaces: PipelineRunWorkspace[];
  private _sa: string;
  private _crbProps: ApiObjectProps;

  /**
   * Creates a new instance of the `PipelineRunBuilder` for the specified
   * `Pipeline` that is built by the `PipelineBuilder` supplied here.
   *
   * A pipeline run is configured only for a specific pipeline, so it did not
   * make any sense here to allow the run to be created without the pipeline
   * specified.
   *
   * @param scope The `Construct` in which to create the `PipelineRun`.
   * @param id The logical ID of the `PipelineRun` construct.
   * @param pipeline The `Pipeline` for which to create this run, using the `PipelineBuilder`.
   */
  public constructor(scope: Construct, id: string, pipeline: PipelineBuilder) {
    this._scope = scope;
    this._id = id;
    this._pipeline = pipeline;
    this._sa = DefaultPipelineServiceAccountName;
    this._crbProps = DefaultClusterRoleBindingProps;
    this._runParams = new Array<PipelineRunParam>();
    this._runWorkspaces = new Array<PipelineRunWorkspace>();
  }

  /**
   * Adds a run parameter to the `PipelineRun`. It will throw an error if you try
   * to add a parameter that does not exist on the pipeline.
   *
   * @param name The name of the parameter added to the pipeline run.
   * @param value The value of the parameter added to the pipeline run.
   */
  public withRunParam(name: string, value: string): PipelineRunBuilder {
    const params = this._pipeline.params;
    const p = params.find((obj) => obj.name === name);
    if (p) {
      this._runParams.push({
        name: name,
        value: value,
      });
    } else {
      throw new Error(`PipelineRun parameter '${name}' does not exist in pipeline '${this._pipeline.name}'`);
    }
    return this;
  }

  /**
   * Allows you to specify the name of a `PersistentVolumeClaim` but does not
   * do any compile-time validation on the volume claim's name or existence.
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim
   *
   * @param name The name of the workspace in the `PipelineRun` that will be used by the `Pipeline`.
   * @param claimName The name of the `PersistentVolumeClaim` to use for the `workspace`.
   * @param subPath The sub path on the `persistentVolumeClaim` to use for the `workspace`.
   */
  public withWorkspace(name: string, claimName: string, subPath: string): PipelineRunBuilder {
    this._runWorkspaces.push({
      name: name,
      persistentVolumeClaim: {
        claimName: claimName,
      },
      subPath: subPath,
    });
    return this;
  }

  public withClusterRoleBindingProps(props: ApiObjectProps): PipelineRunBuilder {
    this._crbProps = props;
    return this;
  }

  /**
   * Uses the provided role name for the `serviceAccountName` on the
   * `PipelineRun`. If this method is not called prior to `buildPipelineRun()`,
   * then the default service account will be used, which is _default:pipeline_.
   *
   * @param sa The name of the service account (`serviceAccountName`) to use.
   */
  public withServiceAccount(sa: string): PipelineRunBuilder {
    this._sa = sa;
    return this;
  }

  /**
   * Builds the `PipelineRun` for the configured `Pipeline` used in the constructor.
   * @param opts
   */
  public buildPipelineRun(opts: BuilderOptions = DefaultBuilderOptions): void {
    if (opts && opts.includeDependencies) {
      // Generate the ClusterRoleBinding document, if configured to do so.
      new ApiObject(this._scope, this._crbProps.metadata?.name!, this._crbProps);
    }

    // Throw an error here if the parameters are not defined that are required
    // by the Pipeline, because there is really no point in going any further.
    const params = this._pipeline.params;
    params.forEach((p) => {
      const prp = this._runParams.find((obj) => obj.name == p.name);
      if (!prp) {
        throw new Error(`Pipeline parameter '${p.name}' is not defined in PipelineRun '${this._id}'`);
      }
    });

    // Do the same thing for workspaces. Check to make sure that the workspaces
    // expected by the Pipeline are defined in the PipelineRun.
    const workspaces: PipelineWorkspace[] = this._pipeline.workspaces;
    workspaces.forEach((ws) => {
      const pws = this._runWorkspaces.find((obj) => obj.name == ws.name);
      if (!pws) {
        throw new Error(`Pipeline workspace '${ws.name}' is not defined in PipelineRun '${this._id}'`);
      }
    });

    new PipelineRun(this._scope, this._id, {
      metadata: {
        name: this._id,
      },
      serviceAccountName: this._sa,
      spec: {
        pipelineRef: {
          name: this._pipeline.name,
        },
        params: this._runParams,
        workspaces: this._runWorkspaces,
      },
    });
  }
}
