import { Router } from 'express';

import AuthRoute from './AuthRoute';

const router = Router();

router.use('/auth', AuthRoute);

export default router;