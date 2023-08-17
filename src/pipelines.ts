import { ApiObject, ApiObjectMetadata, GroupVersionKind } from 'cdk8s';
import { Construct } from 'constructs';
import { NamedResource } from './common';
import { TaskParam, TaskRef, TaskWorkspace, TaskWorkspaceRef } from './tasks';

// The following interfaces and classes are strictly for generating the YAML or
// JSON in the proper format for the Tekton pipelines. See the builders to use
// classes and a fluid-style syntax that provides easier building and checking.

/**
 * A Pipeline parameter. See https://tekton.dev/docs/pipelines/pipelines/#specifying-parameters
 */
export interface PipelineParam extends NamedResource {
  readonly type?: string;
  readonly default?: string;
}

/**
 * A task in a pipeline. See https://tekton.dev/docs/pipelines/pipelines/#adding-tasks-to-the-pipeline
 */
export interface PipelineTask extends NamedResource {
  readonly taskRef?: TaskRef;
  readonly params?: TaskParam[];
  readonly runAfter?: string[];
  readonly workspaces?: TaskWorkspace[];
}

export interface PipelineWorkspace extends NamedResource {
  readonly description?: string;
}

/**
 * A
 */
export interface PipelineTaskDef extends PipelineTask {
  readonly refParams?: PipelineParam[];
  readonly refWorkspaces?: TaskWorkspaceRef[];
}

export interface PipelineSpec {
  readonly description?: string;
  readonly params?: PipelineParam[];
  readonly tasks?: PipelineTask[];
  readonly workspaces?: PipelineWorkspace[];
}

/**
 * Properties used to create the Pipelines.
 */
export interface PipelineProps {
  readonly metadata?: ApiObjectMetadata;
  readonly spec?: PipelineSpec;
}

/**
 *
 *
 * @schema Pipeline
 */
export class Pipeline extends ApiObject {

  /**
   * Returns the apiVersion and kind for "Pipeline"
   */
  public static readonly GVK: GroupVersionKind = {
    apiVersion: 'tekton.dev/v1beta1',
    kind: 'Pipeline',
  };

  private readonly _metadata?: ApiObjectMetadata;
  private readonly _spec?: PipelineSpec;

  /**
   * Renders a Kubernetes manifest for "Pipeline".
   *
   * This can be used to inline resource manifests inside other objects (e.g. as templates).
   *
   * @param props initialization props
   */
  // public static manifest(props: PipelineProps = {}): any {
  //   return {
  //     ...Pipeline.GVK,
  //     ...
  //   };
  // }

  /**
   * Defines a "Pipeline" API object
   * @param scope the scope in which to define this object
   * @param id a scope-local name for the object
   * @param props initialization props
   */
  public constructor(scope: Construct, id: string, props: PipelineProps = {}) {
    super(scope, id, {
      ...Pipeline.GVK,
    });
    this._metadata = props.metadata;
    this._spec = props.spec;
  }


  /**
   * Renders the object to Kubernetes JSON.
   */
  public toJson(): any {
    const result = {
      ...Pipeline.GVK,
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
