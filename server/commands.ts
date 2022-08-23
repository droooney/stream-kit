import { Command, PermissionsType } from './types/twitch';

import { rootNs } from './ws';

export const COMMANDS: Partial<Record<string, Command>> = {
  '!commands': {
    permissions: PermissionsType.ANY,
    response: () => {
      const commands = Object.keys(COMMANDS)
        .filter((command) => command !== '!commands')
        .sort()
        .join(', ');

      return `Available commands: ${commands}`;
    },
  },
  '!deaths': {
    permissions: PermissionsType.ANY,
    response: ({ deaths }) => `Since Aug 23 2022 wineclown has died ${deaths} times on stream`,
  },
  '!mods': {
    permissions: PermissionsType.ANY,
    response: () => 'Megabase mods used: https://steamcommunity.com/sharedfiles/filedetails/?id=2830767656',
  },
  '!song': {
    permissions: PermissionsType.ANY,
    response: async () => {
      rootNs.emit('getCurrentSong');

      const song = await rootNs.waitForEvent('getCurrentSong');

      return `Current song: ${song}`;
    },
  },
};
