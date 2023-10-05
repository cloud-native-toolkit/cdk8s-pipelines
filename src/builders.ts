/**
 * This file has builders in it for the various pipeline constructs.
 */


import * as fs from 'fs';
import { ApiObject, ApiObjectProps, Yaml } from 'cdk8s';
import { Construct } from 'constructs';
import { buildParam } from './common';
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
import { Task, TaskEnvValueSource, TaskParam, TaskProps, TaskSpecParam, TaskStep, TaskStepEnv, TaskWorkspace } from './tasks';

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
 */
export class WorkspaceBuilder {
  private readonly _logicalID: string;
  private _name?: string;
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
    return this._name;
  }

  /**
   * Gets the description of the workspace.
   */
  public get description(): string {
    return this._description || '';
  }

  public withName(name: string): WorkspaceBuilder {
    this._name = name;
    return this;
  }

  public withDescription(desc: string): WorkspaceBuilder {
    this._description = desc;
    return this;
  }

}

/**
 * Builds the parameters for use by Tasks and Pipelines.
 */
export class ParameterBuilder {
  private readonly _logicalID: string;
  private _name?: string;
  private _description?: string;
  private _type?: string;
  private _value?: string;
  private _defaultValue?: string;
  private _requiresPipelineParam: boolean;

  constructor(id: string) {
    this._logicalID = id;
    this._requiresPipelineParam = false;
  }

  /**
   * Gets the logicalID for the `ParameterBuilder`, which is used by the underlying
   * construct.
   */
  public get logicalID(): string | undefined {
    return this._logicalID;
  }

  public get name(): string | undefined {
    return this._name;
  }

  public get description(): string {
    return this._description || '';
  }

  /**
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
  public withValue(val: string): ParameterBuilder {
    // If you are giving it a value here, then you do not
    // need the Pipeline parameter for this parameter.
    this._requiresPipelineParam = false;
    this._value = val;
    return this;
  }

  /**
   * Gets the value of the parameter
   */
  public get value(): string | undefined {
    return this._value;
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
   * Sets the default value for the parameter.
   * @param pipelineParamName
   * @param defaultValue
   */
  public withPiplineParameter(pipelineParamName: string, defaultValue: string = ''): ParameterBuilder {
    this._requiresPipelineParam = true;
    this._name = pipelineParamName;
    this._defaultValue = defaultValue;
    this._value = buildParam(pipelineParamName);
    return this;
  }

  /**
   * Returns true if this parameter expects input at the pipeline level.
   */
  public get requiresPipelineParameter(): boolean {
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
   *
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

  public get workingDir(): string | undefined {
    return this._dir;
  }

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
  // These were initially arrays, but converted them to maps so that if
  // multiple values are added that the last one will win.
  private _workspaces = new Map<string, WorkspaceBuilder>;
  private _params = new Map<string, ParameterBuilder>;

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
   * Gets the name of the `Task` built by the `TaskBuilder`.
   */
  public get name(): string | undefined {
    return this._name;
  }

  /**
   * Sets the name of the `Task` being built.
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

  public get workspaces(): WorkspaceBuilder[] | undefined {
    return Array.from(this._workspaces?.values());
  }

  public withStringParam(param: ParameterBuilder): TaskBuilder {
    this._params.set(param.logicalID!, param.ofType('string'));
    return this;
  }

  public get parameters(): ParameterBuilder[] | undefined {
    return Array.from(this._params?.values());
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
        default: p.defaultValue,
      });
    });

    const taskWorkspaces = new Array<TaskWorkspace>();
    this._workspaces?.forEach((ws) => {
      taskWorkspaces.push({
        name: ws.logicalID,
        description: ws.description,
      });
    });

    const props: TaskProps = {
      metadata: {
        name: this.name,
      },
      spec: {
        description: this.description,
        workspaces: taskWorkspaces,
        params: taskParams,
        steps: taskSteps,
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
  private _name?: string;
  private _description?: string;
  private _tasks?: TaskBuilder[];

  public constructor(scope: Construct, id: string) {
    this._scope = scope;
    this._id = id;
  }

  /**
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
    return this._name || this._id;
  }

  /**
   * Provides the name for the pipeline task and will be
   * rendered as the `name` property.
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
    this._tasks?.forEach((t) => {
      t.parameters?.forEach(p => {
        const pp = pipelineParams.get(p.name!);
        if (!pp) {
          // Do not add it to the pipeline if there is no need to add it...
          if (p.requiresPipelineParameter) {
            pipelineParams.set(p.name!, {
              name: p.name,
              type: p.type,
            });
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
        // Only add the workspace on the pipeline level if it is not already
        // there...
        const ws = pipelineWorkspaces.get(w.name!);
        if (!ws) {
          pipelineWorkspaces.set(w.name!, {
            name: w.name,
            description: w.description,
          });
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

    this._tasks?.forEach((t, i) => {

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
          workspace: w.name,
        });
      });

      const pt = createOrderedPipelineTask(t, ((i > 0) ? this._tasks![i - 1].logicalID : ''), taskParams, taskWorkspaces);

      pipelineTasks.push(pt);

      if (opts.includeDependencies) {
        // Build the task if the user has asked for the dependencies to be
        // built along with the pipeline, but only if we haven't already
        // built the task yet.
        if (!taskList.find(it => {
          return it == t.name;
        })) {
          t.buildTask();
        }
        taskList.push(t.name!);
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

function createOrderedPipelineTask(t: TaskBuilder, after: string, params: TaskParam[], ws: TaskWorkspace[]): PipelineTask {
  if (after) {
    return {
      name: t.logicalID,
      taskRef: {
        name: t.name,
      },
      runAfter: [after],
      params: params,
      workspaces: ws,
    };
  }
  return {
    name: t.logicalID,
    taskRef: {
      name: t.name,
    },
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
      if (! pws) {
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