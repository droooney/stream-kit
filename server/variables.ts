import path from 'node:path';
import fs from 'node:fs';
import { promisify } from 'node:util';

import { Variables } from './types/twitch';

const filename = path.resolve('./server/db/variables.json');
const writeFile = promisify(fs.writeFile);

const DEFAULTS: Variables = {
  deaths: 0,
};

const variables = getVariables();

export function getVariables(): Variables {
  let jsonVariables: Partial<Variables>;

  try {
    jsonVariables = JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch {
    jsonVariables = {};
  }

  return {
    ...DEFAULTS,
    ...jsonVariables,
  };
}

export async function saveVariables(): Promise<void> {
  await writeFile(filename, JSON.stringify(variables, null, 2));
}

export function getVariable<V extends keyof Variables>(variable: V): Variables[V] {
  return variables[variable];
}

export async function setVariable<V extends keyof Variables>(variable: V, value: Variables[V]): Promise<void> {
  variables[variable] = value;

  await saveVariables();
}
