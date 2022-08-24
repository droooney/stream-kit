import { Command, PermissionsType } from './types/twitch';

import { rootNs } from './ws';
import { getVariable, setVariable } from './variables';

export const COMMANDS: Partial<Record<string, Command>> = {
  '!commands': {
    permissions: PermissionsType.ANY,
    response: ({ permissions }) => {
      const commands = Object.entries(COMMANDS)
        .filter(
          ([commandString, command]) => commandString !== '!commands' && command && permissions >= command.permissions,
        )
        .map(([commandString]) => commandString)
        .sort()
        .join(', ');

      return `Available commands: ${commands}`;
    },
  },
  '!deaths': {
    permissions: PermissionsType.ANY,
    response: () => `Since Aug 23 2022 wineclown has died ${getVariable('deaths')} times on stream`,
  },
  '!adddeath': {
    permissions: PermissionsType.MODERATOR,
    response: async (options) => {
      await setVariable('deaths', getVariable('deaths') + 1);

      const response = await COMMANDS['!deaths']?.response(options);

      if (response) {
        return `Death added. ${response}`;
      }
    },
  },
  '!removedeath': {
    permissions: PermissionsType.MODERATOR,
    response: async (options) => {
      await setVariable('deaths', Math.max(0, getVariable('deaths') - 1));

      const response = await COMMANDS['!deaths']?.response(options);

      if (response) {
        return `Death removed. ${response}`;
      }
    },
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

      return `Current song: "${song}"`;
    },
  },
};
