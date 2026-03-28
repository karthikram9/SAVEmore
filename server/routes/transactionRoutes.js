import express from 'express';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(auth, getTransactions).post(auth, addTransaction);
router.route('/:id').delete(auth, deleteTransaction);

export default router;
