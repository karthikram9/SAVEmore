import Transaction from '../models/Transaction.js';

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { type, category, month } = req.query;

    const query = { userId: req.userId };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (month) {
      // Expecting month formatted as "YYYY-MM"
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get summary of transactions
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
      }

      const cat = t.category;
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = 0;
      }
      categoryBreakdown[cat] += t.amount;
    });

    const balance = totalIncome - totalExpense;

    const breakdownArray = Object.keys(categoryBreakdown).map((key) => ({
      name: key,
      value: categoryBreakdown[key],
    }));

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        breakdown: breakdownArray,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Please provide type, amount, and category' });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : Date.now(),
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(401).json({ success: false, message: 'User not authorized to update this record' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns the modified document
    );

    res.status(200).json({ success: true, data: updatedTransaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(401).json({ success: false, message: 'User not authorized to delete this record' });
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
