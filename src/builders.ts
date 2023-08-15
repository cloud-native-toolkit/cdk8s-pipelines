/**
 * This file has builders in it for the various pipeline constructs.
 */


import { Pipeline, PipelineTaskDef } from './pipelines';
import { Construct } from 'constructs';
import { TaskRef } from './tasks';

/**
 * The PipelineTaskBuilder creates a PipelineTaskDef, which is used to
 * intelligently add a task and its properties to a Pipeline.
 */
export class PipelineTaskBuilder {
  private name?: string;
  private taskRefName?: string;
  /**
   * Creates a new instance of the PipelineTaskBuilder
   */
  constructor() {
  }

  public withName(name: string): PipelineTaskBuilder {
    this.name = name;
    return this;
  }

  public withTaskReference(ref: string): PipelineTaskBuilder {
    this.taskRefName = ref;
    return this;
  }

  /**
   * Builds the Pipeline
   */
  public build() : PipelineTaskDef {
    // TODO: An important part of build here is to assert that the
    // object has been correctly made and throw very meaningful errors.
    const pt = {
      name: this.name,
      taskRef: new TaskRef(this.taskRefName!),
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
  constructor() {
  }
}