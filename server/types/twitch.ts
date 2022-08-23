export interface Command {
  permissions: PermissionsType;
  response: (variables: Variables) => Promise<string> | string;
}

export enum PermissionsType {
  ANY,
  MODERATOR,
  OWNER,
}

export interface Variables {
  deaths: number;
}
