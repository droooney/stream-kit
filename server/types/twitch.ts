import { MaybePromise } from '../../types';

export interface Command {
  permissions: PermissionsType;
  response: () => MaybePromise<string | null | undefined>;
}

export enum PermissionsType {
  ANY,
  MODERATOR,
  OWNER,
}

export interface Variables {
  deaths: number;
}
