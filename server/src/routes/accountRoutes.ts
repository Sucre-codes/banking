import { Router } from 'express';
import { deposit, getProfile, transactions, transfer, withdraw } from '../controllers/accountController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { depositSchema, transferSchema, withdrawSchema } from '../utils/validation';

const router = Router();

router.use(requireAuth);

router.get('/me', getProfile);
router.post('/deposit', validateBody(depositSchema), deposit);
router.post('/withdraw', validateBody(withdrawSchema), withdraw);
router.post('/transfer', validateBody(transferSchema), transfer);
router.get('/transactions', transactions);

export default router;