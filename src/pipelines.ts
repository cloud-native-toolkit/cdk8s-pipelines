import { ApiObject, ApiObjectMetadata, GroupVersionKind } from 'cdk8s';
import { Construct } from 'constructs';
import { NamedResource } from './common';
import { TaskParam, TaskRef } from './tasks';

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
}


export interface Workspace extends NamedResource {
  readonly workspace?: string;
}

/**
 * A
 */
export interface PipelineTaskDef extends PipelineTask {
  readonly refParams?: PipelineParam[];
}

export interface PipelineSpec {
  readonly params?: PipelineParam[];
  readonly tasks?: PipelineTask[];
  readonly workspaces?: Workspace[];
}

/**
 * Properties used to create the Pipelines.
 */
export interface PipelineProps extends NamedResource {
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
    this._metadata = {
      name: props.name,
    };
    this._spec = {
      tasks: new Array<PipelineTask>(),
      params: new Array<PipelineParam>(),
    };
  }

  public addTask(t: PipelineTaskDef, after: PipelineTaskDef = {}): void {
    // First, take a look, at the params in the params to see if there
    // is any variable interpolation, and add the tasks if there is...
    if (t.refParams != null && t.refParams.length > 0) {
      t.refParams.forEach(ref => {
        let p = this._spec?.params?.find(f => f.name == ref.name);
        if (p == null) {
          this._spec?.params?.push({
            name: ref.name,
            default: ref.default,
            type: ref.type,
          });
        }
      });
    }

    if (after != null && after.name != null && after.name?.length > 0) {
      this._spec?.tasks?.push({
        name: t.name,
        taskRef: t.taskRef,
        params: t.params,
        runAfter: [after.name],
      });
    } else {
      this._spec?.tasks?.push({
        name: t.name,
        taskRef: t.taskRef,
        params: t.params,
      });
    }
  }

  public addStringParam(name: string, defaultValue: string = ''): void {
    this._spec?.params?.push({
      name: name,
      type: 'string',
      default: defaultValue,
    });
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
