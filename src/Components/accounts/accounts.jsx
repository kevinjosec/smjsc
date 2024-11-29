import React, { useState, useEffect, useCallback } from "react";
import "./accounts.css";
import Usernavbar from "../user-navbar/userNavbar";
import { MdAdd } from "react-icons/md";
import accountServices from "../../services/accountServices";
import { useAuthContext } from "../../hooks/useAuthContext";
import getUserRole from "../../services/userServices";
import { Line } from "react-chartjs-2";
import { plugins } from "chart.js";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components you need
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Accounts = () => {
  const [role, setRole] = useState();
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (KWD)",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  };
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const savedMonth = localStorage.getItem("selectedMonth");
    return savedMonth || "July";
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const savedYear = localStorage.getItem("selectedYear");
    return savedYear ? parseInt(savedYear, 10) : new Date().getFullYear();
  });
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [accounts, setAccounts] = useState({ income: [], expense: [] });

  const [income, setIncome] = useState({
    date: "",
    amount: "",
    description: "",
    source: "",
    receivedBy: "Headmaster",
    donatedBy: "",
    generatedAt: new Date().toISOString(), // Added for tracking
  });

  const [expense, setExpense] = useState({
    date: "",
    amount: "",
    description: "",
    spentOn: "",
    spentBy: "",
    issuedBy: "",
    generatedAt: new Date().toISOString(), // Added for tracking
  });

  const { user } = useAuthContext();

  const fetchAccounts = useCallback(
    async (year, month) => {
      try {
        const RES = await getUserRole();
        setRole(RES);

        const accountData = await accountServices.getAccountByYearMonth(
          year,
          month
        );

        if (accountData && typeof accountData === "object") {
          const income = accountData.income || [];
          const expense = accountData.expense || [];
          setAccounts({ income, expense });

          // Chart data
          try {
            const chartStartDate = new Date("2024-10-01");
            const chartEndDate = new Date();

            const year = chartStartDate.getFullYear(); // Get the year from the start date
            const month = chartStartDate.toLocaleString("default", {
              month: "long",
            });

            const chartData = await accountServices.getAllAccounts(year, month);

            const incomeMap = {};
            const expenseMap = {};

            // Accumulate income and expenses
            chartData.forEach((account) => {
              if (account.income) {
                account.income.forEach((income) => {
                  const dateKey = new Date(income.date).toLocaleDateString(
                    "en-US"
                  );
                  incomeMap[dateKey] =
                    (incomeMap[dateKey] || 0) + income.amount; // Accumulate income by date
                });
              }

              if (account.expense) {
                account.expense.forEach((expense) => {
                  const dateKey = new Date(expense.date).toLocaleDateString(
                    "en-US"
                  );
                  expenseMap[dateKey] =
                    (expenseMap[dateKey] || 0) + expense.amount; // Accumulate expenses by date
                });
              }
            });

            // Generate all dates between chartStartDate and chartEndDate
            const allDates = [];
            const currentDate = new Date(chartStartDate);
            while (currentDate <= chartEndDate) {
              allDates.push(new Date(currentDate).toLocaleDateString("en-US"));
              currentDate.setDate(currentDate.getDate() + 1); // Increment the date
            }

            // Create the labels and corresponding income and expense data
            const labels = allDates.sort((a, b) => new Date(a) - new Date(b));
            const chartIncomeData = labels.map(
              (label) => incomeMap[label] || 0
            );
            const chartExpenseData = labels.map(
              (label) => expenseMap[label] || 0
            );

            setLineChartData({
              labels: labels,
              datasets: [
                {
                  label: "Income",
                  data: chartIncomeData,
                  fill: false,
                  borderColor: "#4caf50",
                  tension: 0.2,
                  borderWidth: 4,
                },
                {
                  label: "Expense",
                  data: chartExpenseData,
                  fill: false,
                  borderColor: "red",
                  tension: 0.2,
                  borderWidth: 4,
                },
              ],
            });
          } catch (error) {
            console.error("Error fetching chart data:", error);
            setLineChartData({ labels: [], datasets: [] }); // Reset chart data on error
          }
        } else {
          console.error("Unexpected data structure:", accountData);
          setAccounts({ income: [], expense: [] });
          setLineChartData({ labels: [], datasets: [] }); // Reset chart data on error
        }
      } catch (err) {
        console.error("Error fetching accounts: ", err);
        setAccounts({ income: [], expense: [] });
      }
    },
    [role]
  );

  useEffect(() => {
    if (user) {
      fetchAccounts(selectedYear, selectedMonth);
    }
  }, [fetchAccounts, selectedYear, selectedMonth, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showAddIncomeModal) {
      setIncome({ ...income, [name]: value });
    } else if (showAddExpenseModal) {
      setExpense({ ...expense, [name]: value });
    }
  };

  const handleAddIncomeClick = () => {
    setShowAddIncomeModal(true);
    setShowAddExpenseModal(false);
  };

  const handleAddExpenseClick = () => {
    setShowAddExpenseModal(true);
    setShowAddIncomeModal(false);
  };

  const handleCloseModals = () => {
    setShowAddIncomeModal(false);
    setShowAddExpenseModal(false);
  };

  const handleSubmitIncome = async (e) => {
    e.preventDefault();
    try {
      const incomeData = {
        year: new Date(income.date).getFullYear(),
        month: new Date(income.date).toLocaleString("default", {
          month: "long",
        }),
        income: [{ ...income, generatedAt: new Date().toISOString() }],
      };
      await accountServices.createAccount(incomeData);
      fetchAccounts(selectedYear, selectedMonth);
      handleCloseModals();
    } catch (err) {
      console.error("Error adding income: ", err);
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        year: new Date(expense.date).getFullYear(),
        month: new Date(expense.date).toLocaleString("default", {
          month: "long",
        }),
        expense: [{ ...expense, generatedAt: new Date().toISOString() }],
      };
      await accountServices.createAccount(expenseData);
      fetchAccounts(selectedYear, selectedMonth);
      handleCloseModals();
    } catch (err) {
      console.error("Error adding expense: ", err);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();

    if (
      new Date(`${newMonth} 1, ${selectedYear}`) >
      new Date(`${currentMonth} 1, ${currentYear}`)
    ) {
      alert("You cannot select a future month.");
      return;
    }

    setSelectedMonth(newMonth);
    localStorage.setItem("selectedMonth", newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    const currentYear = new Date().getFullYear();

    if (newYear > currentYear) {
      alert("You cannot select a future year.");
      return;
    }

    setSelectedYear(newYear);
    localStorage.setItem("selectedYear", newYear);
  };

  const isCurrentOrFutureMonthYear = () => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();
    const selectedDate = new Date(`${selectedMonth} 1, ${selectedYear}`);
    const currentDate = new Date(`${currentMonth} 1, ${currentYear}`);

    return selectedDate >= currentDate;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error("Invalid date format:", dateString);
      return "Invalid date"; // Return a fallback if the date is invalid
    }

    // Format the date to a readable format, e.g., "dd-mm-yyyy"
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options); // 'en-GB' gives dd-mm-yyyy format
  };

  const netIncome = accounts.income.reduce(
    (total, item) => total + parseFloat(item.amount || 0),
    0
  );
  const totalExpenses = accounts.expense.reduce(
    (total, item) => total + parseFloat(item.amount || 0),
    0
  );
  const balanceAmount = netIncome - totalExpenses;

  return (
    <div className="accounts-container">
      <Usernavbar />
      <div className="moneynchart">
        <div className="money">
          <div className="net-income">
            {role === "headmaster" ? (
              <h2>{netIncome.toFixed(2)} KWD</h2>
            ) : (
              <h2>XXX KWD</h2>
            )}
            <p>Net Income</p>
          </div>
          <div className="balance-amount">
            {role === "headmaster" ? (
              <h2>{balanceAmount.toFixed(2)} KWD</h2>
            ) : (
              <h2>XXX KWD</h2>
            )}
            <p>Balance Amount</p>
          </div>
          <div className="month-selector">
            <select
              name="month"
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <select
              name="year"
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {[...Array(15).keys()].map((n) => {
                const year = new Date().getFullYear() - n;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="chart-container">
          <Line options={options} data={lineChartData} />
        </div>
      </div>
      <div className="income">
        <h2 className="income-heading">Income</h2>
        {role === "headmaster" && (
          <button
            className={`add-income-button ${
              !isCurrentOrFutureMonthYear() ? "disabled" : ""
            }`}
            onClick={handleAddIncomeClick}
            disabled={!isCurrentOrFutureMonthYear()}
          >
            <MdAdd style={{ fontSize: "1.5em" }} />
            Add an Income
          </button>
        )}
        <div className="income-list">
          {accounts.income.length > 0 ? (
            accounts.income.map((inc, index) => (
              <div key={index} className="income-item">
                <p data-label="Date">
                  {new Date(inc.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {role === "headmaster" ? (
                  <p data-label="Amount">{inc.amount} KWD</p>
                ) : (
                  <p data-label="Amount">XXX KWD</p>
                )}
                <p data-label="Description">{inc.description}</p>
                <p data-label="Source">{inc.source}</p>
                <p data-label="Received By">{inc.receivedBy}</p>
                <p data-label="Donated By">{inc.donatedBy}</p>
                <p data-label="Generated Invoice At">
                  {formatDateString(`${accounts.createdAt}`)}
                </p>
              </div>
            ))
          ) : (
            <p>No income records found.</p>
          )}
        </div>
      </div>

      <div className="expense">
        <h2 className="expense-heading">Expenses</h2>
        {role === "headmaster" && (
          <button
            className={`add-expense-button ${
              !isCurrentOrFutureMonthYear() ? "disabled" : ""
            }`}
            onClick={handleAddExpenseClick}
            disabled={!isCurrentOrFutureMonthYear()}
          >
            <MdAdd style={{ fontSize: "1.5em" }} />
            Add an Expense
          </button>
        )}
        <div className="expense-list">
          {accounts.expense.length > 0 ? (
            accounts.expense.map((exp, index) => (
              <div key={index} className="expense-item">
                <p data-label="Date">
                  {new Date(exp.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {role === "headmaster" ? (
                  <p data-label="Amount">{exp.amount} KWD</p>
                ) : (
                  <p data-label="Amount">XXX KWD</p>
                )}
                <p data-label="Description">{exp.description}</p>
                <p data-label="Spent On">{exp.spentOn}</p>
                <p data-label="Spent By">{exp.spentBy}</p>
                <p data-label="Issued By">{exp.issuedBy}</p>
                <p data-label="Generated Invoice At">
                  {formatDateString(`${accounts.createdAt}`)}
                </p>
              </div>
            ))
          ) : (
            <p>No expenses records found.</p>
          )}
        </div>
      </div>

      {showAddIncomeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Income</h2>
            <form onSubmit={handleSubmitIncome}>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={income.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Amount (KWD):
                <input
                  type="number"
                  name="amount"
                  value={income.amount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={income.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Source:
                <select
                  name="source"
                  value={income.source}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select{" "}
                  </option>
                  <option value="Budget">Subscription</option>
                  <option value="Donation">Donation</option>
                  <option value="Sponsorship">JSVBS registration</option>
                </select>
              </label>

              <label>
                Received By:
                <input
                  type="text"
                  name="receivedBy"
                  value={income.receivedBy}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Donated By:
                <input
                  type="text"
                  name="donatedBy"
                  value={income.donatedBy}
                  onChange={handleChange}
                />
              </label>
              <label>
                Generated Invoice At:
                <input
                  type="text"
                  name="generatedAt"
                  value={new Date(income.generatedAt).toLocaleString()}
                  readOnly
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModals}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmitExpense}>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={expense.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Amount (KWD):
                <input
                  type="number"
                  name="amount"
                  value={expense.amount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={expense.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Source:
                <select
                  name="spentOn"
                  value={expense.spentOn}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select{" "}
                  </option>
                  <option value="Budget">Snacks</option>
                  <option value="Donation">Transportation</option>
                  <option value="Sponsorship">Exams</option>
                </select>
              </label>

              <label>
                Spent By:
                <input
                  type="text"
                  name="spentBy"
                  value={expense.spentBy}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Issued By:
                <input
                  type="text"
                  name="issuedBy"
                  value={expense.issuedBy}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Generated Invoice At:
                <input
                  type="text"
                  name="generatedAt"
                  value={new Date(expense.generatedAt).toLocaleString()}
                  readOnly
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModals}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
