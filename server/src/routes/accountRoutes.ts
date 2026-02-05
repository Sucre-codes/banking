import { Router } from 'express';
import {
  deposit,
  getProfile,
  getTransactions,
  transfer,
  withdraw,
  setPinHandler,
  externalTransferHandler,
  createCard
} from '../controllers/accountController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  depositSchema,
  externalTransferSchema,
  pinSchema,
  transferSchema,
  withdrawSchema
} from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/me', getProfile);
router.post('/pin', validateBody(pinSchema), setPinHandler);
router.post('/virtual-card', createCard);
router.post('/deposit', validateBody(depositSchema), deposit);
router.post('/withdraw', validateBody(withdrawSchema), withdraw);
router.post('/transfer', validateBody(transferSchema), transfer);
router.post('/external-transfer', validateBody(externalTransferSchema), externalTransferHandler);
router.get('/transactions', getTransactions);

export default router;