// const paramNameRegex = new RegExp('^[a-zA-Z_][-a-zA-Z0-9_]+$');

// function hasValidName(res: NamedResource): boolean {
//   let valid = false;
//   if (res.name) {
//     valid = paramNameRegex.test(res.name);
//   }
//   return valid;
// }

/**
 * The supported apiVerion for the Pipelines, Tasks, etc.
 */
export const TektonV1ApiVersion = 'tekton.dev/v1';

export interface NamedResource {
  readonly name?: string;
}

export interface NameKeyPair extends NamedResource {
  readonly key?: string;
}

export function secretKeyRef(name: string, key: string): NameKeyPair {
  return {
    name: name,
    key: key,
  };
}

/**
 * Convenience method for formatting the value of a working directory.
 * @param workspace
 */
export function usingWorkspacePath(workspace: string): string {
  return `$(workspaces.${workspace}.path)`;
}

/**
 * Builds the correct string for referencing the parameter specified by `name`
 * that can be used when building tasks and others.
 *
 * For example, if the parameter is `foo`, the result will be `$(params.foo)`.
 * @param name The name of the parameter.
 */
export function usingBuildParameter(name: string): string {
  return `$(params.${name})`;
}

/**
 * Builds the correct string for building a reference to the file in which the
 * result can be written during the execution of the Task. For example, if the
 * name of the result is `foo`, this function will return `$(results.foo.path)`.
 *
 * @see https://tekton.dev/docs/pipelines/tasks/#emitting-results
 * @param resultName The name of the result from the task.
 */
export function usingResultsPath(resultName: string): string {
  return `$(results.${resultName}.path)`;
}