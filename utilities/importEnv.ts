import path from 'node:path';

import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'production' ? path.resolve('.env') : path.resolve('.dev.env'),
});

config({
  path: process.env.NODE_ENV === 'production' ? path.resolve('.secret.env') : path.resolve('.dev.secret.env'),
});
