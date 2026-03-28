import express from 'express';
import {
  getTransactions,
  getTransactionSummary,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route('/summary').get(auth, getTransactionSummary);

router.route('/').get(auth, getTransactions).post(auth, addTransaction);
router.route('/:id').put(auth, updateTransaction).delete(auth, deleteTransaction);

export default router;
