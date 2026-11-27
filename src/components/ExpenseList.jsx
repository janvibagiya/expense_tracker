import { useEffect, useState } from "react";
import "../styles/ExpenseList.css";
import ConfirmationModal from "./ConfirmationModal";
import EditModal from "./EditModal";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ExpenseList() {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const loadExpenses = () => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(savedExpenses);
  };

  useEffect(() => {
    // Safe: we only read localStorage on amount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExpenses();
  }, []);
  const totalAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  //Filtered expenses
  const filteredExpenses = expenses.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesSearch = item.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  //Handlers
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    const updatedExpenses = expenses.filter((item) => item.id !== id);

    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    setExpenses(updatedExpenses);
    setDeleteExpense(null);
  };

  const editHandler = (id) => {
    setEditId(id);
    setOpenModel(true);
  };
  //Read more handler
  const handleReadMore = (id) => {
    navigate(`/expenseDetails/${id}`);
  };

  return (
    <>
      <div className={`ExpenseList ${theme}`}>
        <div className="list-search">
          <div>
            <h1>Your expenses</h1>
            <p className="list-help">
              Search, edit, or remove an expense below.
            </p>
          </div>

          <div>
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All categories</option>
              <option value="food">Food</option>
              <option value="Transportation">Travel</option>
              <option value="education">Education</option>
              <option value="shopping">Shopping</option>
              <option value="phoneBill">Phone Bill</option>
              <option value="entertainment">Entertainment</option>
            </select>

            <input
              type="search"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.amount}</td>
                  <td>{expense.description}</td>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td className="table-action">
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => setDeleteExpense(expense)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn-edit"
                      onClick={() => editHandler(expense.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-readmore"
                      onClick={() => handleReadMore(expense.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No Expenses found
                </td>
              </tr>
            )}

            <tr className="expense-total">
              <td colSpan="7">Total Amount: {totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {deleteExpense !== null && (
        <ConfirmationModal
          title="Delete Expense"
          message={"Are you sure you want to delete this expense "}
          confirmText="Delete"
          cancleText="Cancle"
          onCancel={() => setDeleteExpense(null)}
          onConfirm={() => handleDelete(deleteExpense.id)}
        />
      )}
      {openModel && editId !== null && (
        <EditModal
          editId={editId}
          onClose={() => setOpenModel(false)}
          onUpdate={loadExpenses}
        />
      )}
    </>
  );
}
