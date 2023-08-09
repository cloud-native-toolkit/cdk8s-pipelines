const paramNameRegex = new RegExp('^[a-zA-Z_][-a-zA-Z0-9_]+$');

function hasValidName(res: NamedResource): boolean {
  let valid = false;
  if (res.name) {
    valid = paramNameRegex.test(res.name);
  }
  return valid;
}

export interface NamedResource {
  readonly name?: string;
}
