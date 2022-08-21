import TwitchJs from 'twitch-js';
import colors from 'colors';
import dayjs from 'dayjs';

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
    console.log(`${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} joined the chat`);
  });

  chat.on('PART', (event) => {
    console.log(`${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} left the chat`);
  });

  chat.on('PRIVMSG', (event) => {
    console.log(
      `${formatTimestamp(event.timestamp)}: ${formatUsername(event.username)} wrote ${formatMessage(event.message)}`,
    );
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
