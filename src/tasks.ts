import { ApiObject, ApiObjectMetadata, GroupVersionKind } from 'cdk8s';
import { Construct } from 'constructs';
import { NamedResource } from './common';

/**
 * A workspace used by a Task. See https://tekton.dev/docs/pipelines/workspaces/#using-workspaces-in-tasks for more information.
 */
export interface TaskWorkspace extends NamedResource{
  readonly workspace?: string;
}

export interface TaskWorkspaceRef extends TaskWorkspace {
  readonly description?: string;
}

export class TaskRef {
  name?: string;

  constructor(name: string) {
    this.name = name;
  }
}

/**
 * A Task parameter.
 */
export interface TaskParam extends NamedResource {
  /**
   * The value of the task parameter.
   */
  readonly value?: string;
}

/**
 * Properties used to create the Pipelines.
 */
export interface TaskProps extends NamedResource {
}

/**
 * The step for a Task. See https://tekton.dev/docs/pipelines/tasks/#defining-steps
 */
export interface TaskStep extends NamedResource {
  readonly image?: string;
  readonly script?: string;
}

/**
 * The Task spec.
 */
export interface TaskSpec {
  readonly steps?: TaskStep[];
}

/**
 *
 *
 * @schema Task
 */
export class Task extends ApiObject {
  /**
   * Returns the apiVersion and kind for "Task"
   */
  public static readonly GVK: GroupVersionKind = {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'Task',
  };

  /**
   * Renders a Kubernetes manifest for "Task".
   *
   * This can be used to inline resource manifests inside other objects (e.g. as templates).
   *
   * @param props initialization props
   */
  public static manifest(props: TaskProps = {}): any {
    return {
      ...Task.GVK,
      ...props,
    };
  }

  private readonly _metadata?: ApiObjectMetadata;
  private readonly _spec?: TaskSpec;

  /**
   * Defines a "Task" API object
   * @param scope the scope in which to define this object
   * @param id a scope-local name for the object
   * @param props initialization props
   */
  public constructor(scope: Construct, id: string, props: TaskProps = {}) {
    super(scope, id, {
      ...Task.GVK,
      ...props,
    });
  }

  /**
   * Renders the object to Kubernetes JSON.
   */
  public toJson(): any {
    const result = {
      ...Task.GVK,
      ...{
        metadata: this._metadata,
        spec: this._spec,
      },
    };
    return Object.entries(result).reduce((r, i) => (i[1] === undefined) ? r : ({
      ...r,
      [i[0]]: i[1],
    }), {});
  }
}
