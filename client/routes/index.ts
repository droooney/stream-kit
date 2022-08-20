import Router from '@koa/router';

import { endBoss, startBoss } from './bosses';

const router = new Router();

router.post('/startBoss', startBoss);
router.post('/endBoss', endBoss);

export default router;
