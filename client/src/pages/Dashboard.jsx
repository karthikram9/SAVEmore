import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import TransactionModal from '../components/TransactionModal';
import { useNavigate } from 'react-router-dom';
import { getSummary, getTransactions } from '../firebase/transactions';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Plus, Wallet } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6', '#f43f5e', '#14b8a6', '#f59e0b'];

const categoryIcons = {
  Food: '🍔',
  Rent: '🏠',
  Utilities: '⚡',
  Transportation: '🚗',
  Entertainment: '🍿',
  Salary: '💰',
  Freelance: '💻',
  Shopping: '🛍️',
  Health: '⚕️',
  Other: '📦',
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Modal State handling
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Summary
      const summaryData = await getSummary(user.uid);
      setSummary({
        totalIncome: summaryData.totalIncome,
        totalExpense: summaryData.totalExpense,
        balance: summaryData.balance,
      });

      const pieMap = summaryData.categoryBreakdown || {};
      setPieData(
        Object.keys(pieMap).map((k) => ({
          name: k,
          value: pieMap[k],
        }))
      );

      // 2. Fetch All Transactions for Pie and List
      const allTxs = await getTransactions(user.uid);
      setTransactions(allTxs.slice(0, 10));

      // 3. Compute Last 6 Months for Bar Chart
      const dates = [];
      const d = new Date();
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
        const monthString = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = monthDate.toLocaleString('default', { month: 'short' });
        dates.push({ query: monthString, label: monthLabel });
      }

      const computedBarData = dates.map((m) => {
        let inc = 0, exp = 0;
        allTxs.forEach((t) => {
          const tDate = new Date(t.date);
          const tMonthStr = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
          if (tMonthStr === m.query) {
            if (t.type === 'income') inc += t.amount;
            if (t.type === 'expense') exp += t.amount;
          }
        });
        return {
          name: m.label,
          Income: inc,
          Expense: exp,
        };
      });

      setBarData(computedBarData);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  const formatCurrency = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-xl bg-white px-4 py-6 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Total Income</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-green-500">
              {formatCurrency(summary.totalIncome)}
            </dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-white px-4 py-6 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Total Expenses</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-red-500">
              {formatCurrency(summary.totalExpense)}
            </dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-white px-4 py-6 shadow-md ring-2 ring-blue-500 sm:p-6">
            <dt className="truncate text-sm font-medium text-blue-700">Current Balance</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-blue-700">
              {formatCurrency(summary.balance)}
            </dd>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900">
              Spending by Category
            </h3>
            <div className="h-72">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
               <div className="flex h-full items-center justify-center text-gray-400">
                 No expense records found.
               </div>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Income vs Expenses (6 Months)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                  <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Transactions</h3>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <ul className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <li
                  key={t._id}
                  className="flex items-center justify-between p-5 transition hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl shadow-inner">
                      {categoryIcons[t.category] || '📌'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.description || t.category}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(t.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.type === 'income'
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : 'bg-red-50 text-red-700 ring-1 ring-red-600/10'
                      }`}
                    >
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        t.type === 'income' ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </li>
              ))}
              {transactions.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <Wallet className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No transactions</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new transaction.</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl ring-4 ring-blue-500/30 transition-all hover:scale-110 hover:bg-blue-700 focus:outline-none active:scale-95"
      >
        <Plus className="h-8 w-8" />
      </button>

      {/* Centralized Add/Edit Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
