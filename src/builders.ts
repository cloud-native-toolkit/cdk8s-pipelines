/**
 * This file has builders in it for the various pipeline constructs.
 */


import * as fs from 'fs';
import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
import { Pipeline, PipelineParam, PipelineTask, PipelineTaskDef, PipelineTaskWorkspace, PipelineWorkspace } from './pipelines';
import { Task, TaskEnvValueSource, TaskParam, TaskProps, TaskRef, TaskSpecParam, TaskStep, TaskStepEnv, TaskWorkspace } from './tasks';

/**
 * The workspace record (WorkspaceRec) is used by the PipelineTaskBuilder
 * internally to hold information about the parameters.
 */
export interface WorkspaceRec {
  readonly name?: string;
  readonly refName?: string;
  readonly description?: string;
}

/**
 * The parameter record (ParamRec) is used by the PipelineTaskBuilder builder
 * internally to hold values for the parameter reference.
 */
export interface ParamRec {
  readonly name?: string;
  readonly description?: string;
  readonly defaultValue?: string;
  readonly refName?: string;
  readonly type?: string;
  readonly value?: string;
}


export class TaskStepBuilder {
  private _url?: string;
  private _obj?: ApiObject;
  private _name?: string;
  private _dir?: string;
  private _image?: string;
  private _cmd?: string[];
  private _args?: string[];
  private _env?: TaskStepEnv[];

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

  /**
   * Gets the URL from which the script data should be loaded, if it is defined.
   */
  public get scriptUrl(): string | undefined {
    return this._url;
  }

  /**
   * Gets the object that is used for the `script` value, if there is one
   * defined.
   */
  public get scriptObj(): ApiObject | undefined {
    return this._obj;
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
    this._url = url;
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
  public fromScriptObject(obj: ApiObject): TaskStepBuilder {
    this._obj = obj;
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
    if (this.scriptUrl) {
      if (this.scriptObj) {
        throw new Error('Cannot specify both a URL source and an object source for the script.');
      }
      // Load the script from the URL location and use it
      const data = fs.readFileSync(this.scriptUrl, {
        encoding: 'utf8',
        flag: 'r',
      });

      const lines = data.replace(/\n/g, '\\n');
      if (data) {
        return {
          name: this.name,
          image: this.image,
          script: lines,
          workingDir: this.workingDir,
          env: this._env,
        };
      }
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
    return undefined;
  }


}

/**
 * This is the builder for creating Tekton `Task` objects that are independent
 * of a `Pipeline`. They
 *
 * To use a builder for tasks that will be used in a Pipeline, use the
 * `PipelineBuilder` instead.
 */
export class TaskBuilder {

  private readonly _scope?: Construct;
  private readonly _id?: string;
  private _steps?: TaskStepBuilder[];
  private _name?: string;
  private _description?: string;
  private _workspaces?: TaskWorkspace[];
  private _params?: TaskSpecParam[];

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
   * @param name
   * @param description
   */
  public withWorkspace(name: string, description: string = ''): TaskBuilder {
    if (! this._workspaces) {
      this._workspaces = new Array<TaskWorkspace>();
    }
    this._workspaces.push({
      name: name,
      description: description,
    });
    return this;
  }

  public withStringParam(name: string, description: string = '', defaultValue: string = '') : TaskBuilder {
    if (! this._params) {
      this._params = new Array<TaskParam>();
    }
    this._params.push({
      name: name,
      description: description,
      default: defaultValue,
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

    const props: TaskProps = {
      metadata: {
        name: this.name,
      },
      spec: {
        description: this.description,
        workspaces: this._workspaces,
        params: this._params,
        steps: taskSteps,
      },
    };

    new Task(this._scope!, this._id!, props);

  }
}

/**
 * The PipelineTaskBuilder creates a PipelineTaskDef, which is used to
 * intelligently add a task and its properties to a Pipeline.
 */
export class PipelineTaskBuilder {

  /**
   * Creates an instance of this builder with the provided `TaskBuilder` as
   * a source.
   * @param task
   */
  public static createFromTask(task: TaskBuilder) {
    const created = new PipelineTaskBuilder();
    created.withName(task.name!);

    return created;
  }

  private _name?: string;
  private _taskRefName?: string;
  private _workspaces?: WorkspaceRec[];
  private _parameters?: ParamRec[];
  private _after?: string[];

  /**
   * Creates a new instance of the PipelineTaskBuilder
   */
  public constructor() {
  }

  /**
   * Provides the name for the pipeline task and will be
   * rendered as the `name` property.
   * @param name
   */
  public withName(name: string): PipelineTaskBuilder {
    this._name = name;
    return this;
  }

  /**
   * Returns the name of the task being built by the task builder.
   */
  public get name(): string {
    return this._name!;
  }

  /**
   * Returns the parameter records for the task builder.
   */
  public get parameters(): ParamRec[] {
    return this._parameters!;
  }

  /**
   * Returns the workspace records for the task builder.
   */
  public get workspaces(): WorkspaceRec[] {
    return this._workspaces!;
  }

  /**
   * Returns the task reference name for the task builder.
   */
  public get taskReference(): string {
    return this._taskRefName!;
  }

  /**
   * Allows you to specify that this task should be completed after another
   * task. Can be called multiple times to add multiple tasks.
   * @param otherTaskB
   */
  public doAfter(otherTaskB: PipelineTaskBuilder): PipelineTaskBuilder {
    if (!this._after) {
      this._after = new Array<string>();
    }
    this._after.push(otherTaskB.name);
    return this;
  }

  /**
   * Creates and adds a [task reference](https://tekton.dev/docs/pipelines/tasks/#configuring-a-task) to the
   * task, using the value supplied as the name of the reference. It returns
   * a reference to the builder.
   * @param ref The name of the task that is referenced.
   */
  public withTaskReference(ref: string): PipelineTaskBuilder {
    this._taskRefName = ref;
    return this;
  }


  /**
   * Adds workspace information to the pipeline task and returns a
   * reference to the builder.
   * @param name The name of the workspace on the pipeline task.
   * @param refName The `workspace` value, which will be the name of the workspace
   *  at the Pipeline level.
   * @param description The description of the Pipeline workspace.
   */
  public withWorkspace(name: string, refName: string, description: string): PipelineTaskBuilder {
    if (!this._workspaces) {
      this._workspaces = new Array<WorkspaceRec>();
    }
    this._workspaces.push({
      name: name,
      refName: refName,
      description: description,
    });
    return this;
  }

  /**
   * Adds a parameter of type string to both the task and the pipeline itself.
   * @param name The name of the param on the task.
   * @param refName The name of the param at the pipeline level.
   * @param value The value of the parameter on the task.
   * @param description The default value for the param at the pipeline level
   * @param defaultValue The default value for the param at the pipeline level
   */
  public withStringParam(name: string, refName: string, value: string, description: string = '', defaultValue: string = ''): PipelineTaskBuilder {
    if (!this._parameters) {
      this._parameters = new Array<ParamRec>();
    }
    this._parameters!.push({
      name: name,
      value: value,
      refName: refName,
      type: 'string',
      defaultValue: defaultValue,
      description: description,
    });
    return this;
  }

  /**
   * Builds the Pipeline
   */

  public buildPipelineTask(): PipelineTaskDef {
    // TODO: An important part of build here is to assert that the
    // object has been correctly made and throw very meaningful errors.
    const pt = {
      name: this.name,
      taskRef: new TaskRef(this._taskRefName!),
      params: [
        {
          name: 'url',
          value: '$(params.repo-url)',
        },
      ],
      refParams: [
        {
          name: 'repo-url',
          default: '',
          type: 'string',
        },
      ],
      refWorkspaces: [
        {
          name: 'output',
          workspace: 'shared-files',
          description: 'The files that are cloned by the task',
        },
      ],
    };
    return pt;
  }

}

export class PipelineBuilder {
  private readonly _scope?: Construct;
  private readonly _id?: string;
  private _name?: string;
  private _description?: string;
  private _tasks?: PipelineTaskBuilder[];

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
    return this._name!;
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
  public withTask(taskB: PipelineTaskBuilder): PipelineBuilder {
    // Add the task to the list of tasks...
    if (!this._tasks) {
      this._tasks = new Array<PipelineTaskBuilder>();
    }
    this._tasks.push(taskB);
    return this;
  }

  /**
   * Builds the actual [Pipeline]() from the settings configured using the
   * fluid syntax.
   */
  public buildPipeline(): void {
    // TODO: validate the object
    const pipelineParams: PipelineParam[] = new Array<PipelineParam>();
    const pipelineWorkspaces: PipelineWorkspace[] = new Array<PipelineWorkspace>();
    const pipelineTasks: PipelineTask[] = new Array<PipelineTask>();

    this._tasks?.forEach(t => {

      const taskParams: TaskParam[] = new Array<TaskParam>();
      const taskWorkspaces: PipelineTaskWorkspace[] = new Array<TaskWorkspace>();

      t.parameters?.forEach(p => {
        const pp = pipelineParams.find((value, index, obj) => value.name == obj[index].name);
        if (!pp) {
          pipelineParams.push({
            name: p.refName,
            type: p.type,
          });
        }

        taskParams.push({
          name: p.name,
          value: p.value,
        });
      });

      t.workspaces.forEach((w) => {
        // Only add the workspace on the pipeline level if it is not already
        // there...
        const ws = pipelineWorkspaces.find((value, index, obj) => value.name == obj[index].name);
        if (!ws) {
          pipelineWorkspaces.push({
            name: w.refName,
            description: w.description,
          });
        }

        taskWorkspaces.push({
          name: w.name,
          workspace: w.refName,
        });
      });

      pipelineTasks.push({
        name: t.name,
        taskRef: {
          name: t.taskReference,
        },
        params: taskParams,
        workspaces: taskWorkspaces,
      });
    });

    new Pipeline(this._scope!, this._id!, {
      metadata:
        {
          name: this.name,
        },
      spec: {
        description: this._description,
        params: pipelineParams,
        workspaces: pipelineWorkspaces,
        tasks: pipelineTasks,
      },
    });
  }
}
