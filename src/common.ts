// const paramNameRegex = new RegExp('^[a-zA-Z_][-a-zA-Z0-9_]+$');

// function hasValidName(res: NamedResource): boolean {
//   let valid = false;
//   if (res.name) {
//     valid = paramNameRegex.test(res.name);
//   }
//   return valid;
// }

export interface NamedResource {
  readonly name?: string;
}

/**
 * Convenience method for formatting the value of a working directory.
 * @param workspace
 */
export function buildWorkingDir(workspace: string): string {
  return `$(workspaces.${workspace}.path)`;
}

/**
 * Builds the correct string for referencing the parameter specified by `name`
 * that can be used when building tasks and others.
 *
 * For example, if the parameter is `foo`, the result will be
 * @param name The name of the parameter.
 */
export function buildParam(name: string): string {
  return `$(params.${name})`;
}