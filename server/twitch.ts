import TwitchJs from 'twitch-js';
import colors from 'colors';
import dayjs from 'dayjs';

import { BLACKLIST } from './constants/blacklist';

import { PermissionsType } from './types/twitch';

import { COMMANDS } from './commands';

const { BOT_NAME, CHANNEL_NAME, CLIENT_ID, CLIENT_TOKEN } = process.env;

const channelName = CHANNEL_NAME ?? 'wineclown';

const twitchJs = new TwitchJs({
  token: CLIENT_TOKEN,
  clientId: CLIENT_ID,
  username: BOT_NAME,
  log: {
    level: 'warn',
  },
});
const { chat } = twitchJs;

let connectPromise: Promise<void> | undefined;

export async function connect(): Promise<void> {
  if (connectPromise) {
    return await connectPromise;
  }

  await (connectPromise = (async () => {
    await chat.connect();

    await chat.join(channelName);
  })());

  chat.on('JOIN', (event) => {
    if (isBlacklisted(event.username)) {
      return;
    }

    console.log(`${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} joined the chat`);
  });

  chat.on('PART', (event) => {
    if (isBlacklisted(event.username)) {
      return;
    }

    console.log(`${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} left the chat`);
  });

  chat.on('PRIVMSG', async (event) => {
    if (isBlacklisted(event.username)) {
      return;
    }

    console.log(
      `${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} wrote ${formatMessage(event.message)}`,
    );

    const words = event.message.split(/\s+/);
    const commandString = words.find((word) => COMMANDS[word]);
    const permissions =
      event.username === CHANNEL_NAME
        ? PermissionsType.OWNER
        : 'mod' in event.tags && event.tags.mod === '1'
        ? PermissionsType.MODERATOR
        : PermissionsType.ANY;

    if (!commandString) {
      return;
    }

    const command = COMMANDS[commandString];

    if (!command || permissions < command.permissions) {
      return;
    }

    const response = await command.response({ permissions });

    if (response) {
      await sendMessage(response);
    }
  });

  // await sendMessage('test');
}

export async function sendMessage(message: string): Promise<void> {
  await connect();

  await chat.say(channelName, message);
}

function formatTimestamp(timestamp: Date): string {
  return colors.bold(colors.green(`[${dayjs(timestamp).format('DD.MM.YYYY HH:mm:ss')}]`));
}

function formatUsername(username: string): string {
  return colors.bold(colors.red(username));
}

function formatMessage(message: string): string {
  return colors.bold(colors.blue(message));
}

function isBlacklisted(username: string): boolean {
  return BLACKLIST.has(username);
}
