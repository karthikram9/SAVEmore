import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

const collectionName = 'transactions';

export const addTransaction = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      userId,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      description: data.description || '',
      date: new Date(data.date).toISOString(),
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding transaction: ", error);
    throw error;
  }
};

export const getTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ _id: doc.id, ...doc.data() }); 
    });
    return transactions;
  } catch (error) {
    // If indexing is required, Firebase throws an error linking to create the index
    console.error("Error getting transactions: ", error);
    throw error;
  }
};

export const updateTransaction = async (transactionId, data) => {
  try {
    const docRef = doc(db, collectionName, transactionId);
    await updateDoc(docRef, {
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      description: data.description || '',
      date: new Date(data.date).toISOString()
    });
  } catch (error) {
    console.error("Error updating transaction: ", error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, collectionName, transactionId));
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    throw error;
  }
};

export const getSummary = async (userId) => {
  try {
    const transactions = await getTransactions(userId);
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown
    };
  } catch (error) {
    console.error("Error getting summary: ", error);
    throw error;
  }
};
