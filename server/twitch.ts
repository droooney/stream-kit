import TwitchJs, { JoinMessage, PartMessage, PrivateMessages } from 'twitch-js';
import colors from 'colors';

import { formatDate } from '../utilities/date';

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
    console.log(formatJoinEvent(event));
  });

  chat.on('PART', (event) => {
    console.log(formatLeaveEvent(event));
  });

  chat.on('PRIVMSG', (event) => {
    console.log(formatMessageEvent(event));
  });

  // await sendMessage('test');
}

export async function sendMessage(message: string): Promise<void> {
  await connect();

  await chat.say(channelName, message);
}

function formatJoinEvent(event: JoinMessage): string {
  return `${colors.bold(colors.green(formatDate(event.timestamp)))}: ${colors.bold(
    colors.red(event.username),
  )} joined the chat`;
}

function formatLeaveEvent(event: PartMessage): string {
  return `${colors.bold(colors.green(formatDate(event.timestamp)))}: ${colors.bold(
    colors.red(event.username),
  )} left the chat`;
}

function formatMessageEvent(event: PrivateMessages): string {
  return `${colors.bold(colors.green(formatDate(event.timestamp)))}: ${colors.bold(
    colors.red(event.username),
  )} wrote ${colors.bold(colors.blue(event.message))}`;
}
