import { Router } from 'express';
import {
  deposit,
  getProfile,
  transactions,
  transfer,
  withdraw,
  updatePin,
  externalTransferController,
  createCard
} from '../controllers/accountController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  depositSchema,
  externalTransferSchema,
  pinSchema,
  transferSchema,
  withdrawSchema
} from '../utils/validation';

const router = Router();

router.use(requireAuth);

router.get('/me', getProfile);
router.post('/pin', validateBody(pinSchema), updatePin);
router.post('/virtual-card', createCard);
router.post('/deposit', validateBody(depositSchema), deposit);
router.post('/withdraw', validateBody(withdrawSchema), withdraw);
router.post('/transfer', validateBody(transferSchema), transfer);
router.post('/external-transfer', validateBody(externalTransferSchema), externalTransferController);
router.get('/transactions', transactions);

export default router;