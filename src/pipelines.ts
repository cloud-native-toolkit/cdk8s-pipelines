import { ApiObject, ApiObjectMetadata, GroupVersionKind } from 'cdk8s';
import { Construct } from 'constructs';
import { NamedResource, TektonV1ApiVersion } from './common';
import { TaskParam, TaskRef } from './tasks';

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

export interface PipelineTaskWorkspace extends NamedResource {
  readonly workspace?: string;
}

/**
 * A task in a pipeline. See https://tekton.dev/docs/pipelines/pipelines/#adding-tasks-to-the-pipeline
 */
export interface PipelineTask extends NamedResource {
  readonly taskRef?: TaskRef;
  readonly params?: TaskParam[];
  readonly runAfter?: string[];
  readonly workspaces?: PipelineTaskWorkspace[];
}

/**
 * A workspace for a pipeline. See https://tekton.dev/docs/pipelines/pipelines/#specifying-workspaces
 * and https://tekton.dev/docs/pipelines/workspaces/#using-workspaces-in-pipelines.
 */
export interface PipelineWorkspace extends NamedResource {
  /**
   * The description of the workspace.
   */
  readonly description?: string;
}

/**
 * A task definition at the pipeline level.
 */
export interface PipelineTaskDef extends PipelineTask {
  readonly refParams?: PipelineParam[];
  readonly refWorkspaces?: PipelineTaskWorkspace[];
}

/**
 * The `spec` part of the Pipeline.
 *
 * @see https://tekton.dev/docs/pipelines/pipelines/
 */
export interface PipelineSpec {
  /**
   * The description of the `Pipeline`.
   */
  readonly description?: string;
  readonly params?: PipelineParam[];
  /**
   * The `tasks` are required on the Pipeline.
   */
  readonly tasks: PipelineTask[];
  /**
   * Pipeline workspaces.
   *
   * Workspaces allow you to specify one or more volumes that each Task in the
   * Pipeline requires during execution. You specify one or more Workspaces in
   * the workspaces field.
   *
   * @see https://tekton.dev/docs/pipelines/pipelines/#specifying-workspaces
   */
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
 * The Pipeline allows you to specify Tasks that use Parameters and Workspaces
 * to accomplish complex tasks on the cluster.
 *
 * @see https://tekton.dev/docs/pipelines/pipelines/#configuring-a-pipeline
 * @schema Pipeline
 */
export class Pipeline extends ApiObject {

  /**
   * Returns the apiVersion and kind for "Pipeline"
   */
  public static readonly GVK: GroupVersionKind = {
    apiVersion: TektonV1ApiVersion,
    kind: 'Pipeline',
  };

  /**
   * Renders a Kubernetes manifest for "Pipeline".
   *
   * This can be used to inline resource manifests inside other objects (e.g. as templates).
   *
   * @param props initialization props
   */
  public static manifest(props: PipelineProps = {}): any {
    return {
      ...Pipeline.GVK,
      ...props,
    };
  }

  private readonly _metadata?: ApiObjectMetadata;
  private readonly _spec?: PipelineSpec;

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

/**
 * A reference to a `Pipeline` by its name.
 *
 * @see https://tekton.dev/docs/pipelines/pipelineruns/#specifying-the-target-pipeline
 */
export interface PipelineRef {
  /**
   * The name of the `Pipeline` to that is referenced.
   */
  readonly name: string;
}

/**
 * The parameters for a particular `PipelineRun`.
 */
export interface PipelineRunParam extends NamedResource {
  /**
   * The value of the parameter in this `PipelineRun`.
   */
  readonly value: string;
}

/**
 * A reference to a PersistentVolumeClaim
 */
export interface PersistentVolumeClaimRef {
  readonly claimName: string;
}

/**
 * The `Workspace` configuration for a `PipelineRun`.
 *
 * @see https://tekton.dev/docs/pipelines/pipelineruns/#specifying-workspaces
 */
export interface PipelineRunWorkspace extends NamedResource {
  readonly persistentVolumeClaim: PersistentVolumeClaimRef;
  readonly subPath: string;
}

/**
 * The details for the `PipelineRun`.
 * @see https://tekton.dev/docs/pipelines/pipelineruns/#configuring-a-pipelinerun
 */
export interface PipelineRunSpec {
  /**
   * Required `Pipeline` reference.
   */
  readonly pipelineRef: PipelineRef;
  readonly params?: PipelineRunParam[];
  readonly workspaces?: PipelineRunWorkspace[];
}

export interface PipelineRunProps {
  readonly metadata?: ApiObjectMetadata;
  /**
   * Specifies the configuration information for this `PipelineRun` object.
   */
  readonly spec?: PipelineRunSpec;
  /**
   * Specifies a `ServiceAccount` object that supplies specific execution
   * credentials for the `Pipeline`.
   */
  readonly serviceAccountName?: string;
}

/**
 * The PipelineRun allows you to specify how you want to execute a `Pipeline`.
 *
 * @see https://tekton.dev/docs/pipelines/pipelineruns/
 * @schema PipelineRun
 */
export class PipelineRun extends ApiObject {

  /**
   * Returns the apiVersion and kind for "PipelineRun"
   */
  public static readonly GVK: GroupVersionKind = {
    apiVersion: TektonV1ApiVersion,
    kind: 'PipelineRun',
  };

  /**
   * Renders a Kubernetes manifest for `PipelineRun`.
   *
   * This can be used to inline resource manifests inside other objects (e.g. as templates).
   *
   * @param props initialization props
   */
  public static manifest(props: PipelineProps = {}): any {
    return {
      ...PipelineRun.GVK,
      ...props,
    };
  }

  private readonly _metadata?: ApiObjectMetadata;
  private readonly _spec?: PipelineRunSpec;

  /**
   * Defines a `PipelineRun` API object
   * @param scope the scope in which to define this object
   * @param id a scope-local name for the object
   * @param props initialization props
   */
  public constructor(scope: Construct, id: string, props: PipelineRunProps = {}) {
    super(scope, id, {
      ...PipelineRun.GVK,
    });
    this._metadata = props.metadata;
    this._spec = props.spec;
  }


  /**
   * Renders the object to Kubernetes JSON.
   */
  public toJson(): any {
    const result = {
      ...PipelineRun.GVK,
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
