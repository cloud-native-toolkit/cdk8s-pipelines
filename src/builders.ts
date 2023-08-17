/**
 * This file has builders in it for the various pipeline constructs.
 */


import { Construct } from 'constructs';
import { Pipeline, PipelineParam, PipelineTask, PipelineTaskDef, PipelineWorkspace } from './pipelines';
import { TaskParam, TaskRef, TaskWorkspace } from './tasks';

/**
 * The workspace record (WorkspaceRec) is used by the PipelineTaskBuilder
 * internally to hold information about the parameters.
 */
interface WorkspaceRec {
  readonly name?: string;
  readonly refName?: string;
  readonly description?: string;
}

/**
 * The parameter record (ParamRec) is used by the PipelineTaskBuilder builder
 * internally to hold values for the parameter reference.
 */
interface ParamRec {
  readonly name?: string;
  readonly defaultValue?: string;
  readonly refName?: string;
  readonly type?: string;
  readonly value?: string;
}

/**
 * The PipelineTaskBuilder creates a PipelineTaskDef, which is used to
 * intelligently add a task and its properties to a Pipeline.
 */
export class PipelineTaskBuilder {
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
  public getTaskReference(): string {
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
   * @param defaultValue The default value for the param at the pipeline level
   */
  public withStringParam(name: string, refName: string, value: string, defaultValue: string = ''): PipelineTaskBuilder {
    if (!this._parameters) {
      this._parameters = new Array<ParamRec>();
    }
    this._parameters!.push({
      name: name,
      value: value,
      refName: refName,
      type: 'string',
      defaultValue: defaultValue,
    });
    return this;
  }

  /**
   * Builds the Pipeline
   */
  public build(): PipelineTaskDef {
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
  public build(): void {
    // TODO: validate the object
    const pipelineParams: PipelineParam[] = new Array<PipelineParam>();
    const pipelineWorkspaces: PipelineWorkspace[] = new Array<PipelineWorkspace>();
    const pipelineTasks: PipelineTask[] = new Array<PipelineTask>();

    this._tasks?.forEach(t => {

      const taskParams: TaskParam[] = new Array<TaskParam>();
      const taskWorkspaces: TaskWorkspace[] = new Array<TaskWorkspace>();

      t.parameters?.forEach(p => {
        pipelineParams.push({
          name: p.refName,
          type: p.type,
        });

        taskParams.push({
          name: p.name,
          value: p.value,
        });
      });

      t.workspaces.forEach((w) => {
        pipelineWorkspaces.push({
          name: w.refName,
          description: w.description,
        });

        taskWorkspaces.push({
          name: w.name,
          workspace: w.refName,
        });
      });

      pipelineTasks.push({
        name: t.name,
        taskRef: {
          name: t.getTaskReference(),
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