import Router from '@koa/router';

import { endBoss, startBoss } from './bosses';
import { addDeath } from './death';

const router = new Router();

router.post('/startBoss', startBoss);
router.post('/endBoss', endBoss);

router.post('/addDeath', addDeath);

export default router;
