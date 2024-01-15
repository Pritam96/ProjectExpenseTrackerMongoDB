const token = localStorage.getItem("token");
let currentUser;

if (!token) {
  alert("Token is missing");
  window.location.replace("./login.html");
}

document.addEventListener("DOMContentLoaded", (event) => {
  resetForm();
  currentUser = getCurrentUser();
  getExpenses();
});

async function getCurrentUser() {
  try {
    const response = await axios.get("http://localhost:5000/api/user/getMe", {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Current User:", response.data.data);
    console.log("CURRENT USER FETCHED");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function getCategories() {
  try {
    const response = await axios.get("http://localhost:5000/api/category", {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Categories:", response.data.data);
    console.log("CATEGORIES FETCHED");
    if (response.data.data.count !== 0)
      populateCategories(response.data.data.categories);
  } catch (error) {
    console.log(error);
  }
}

function populateCategories(categories) {
  const categorySelect = document.getElementById("expense-category");
  categorySelect.innerText = "";

  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category._id;
    optionElement.innerText = category.categoryName;
    categorySelect.appendChild(optionElement);
  });
}

// Create or Modify Expense Button
const createEditExpenseButton = document.getElementById(
  "add-or-edit-expense-button"
);
createEditExpenseButton.addEventListener("click", createOrEditExpense);

async function createOrEditExpense() {
  const expenseId = document.getElementById("expense-Id");
  const expenseTitle = document.getElementById("expense-title");
  const expenseAmount = document.getElementById("expense-amount");
  const selectedCategory = document.getElementById("expense-category");
  const subExpense = document.getElementById("expense-sub");
  const customCategoryName = document.getElementById(
    "expense-category-custom-text"
  );

  const expenseData = {
    statement: expenseTitle.value.trim(),
    amount: +expenseAmount.value.trim(),
  };

  if (customCategoryName.value !== "") {
    expenseData.newCategoryName = customCategoryName?.value.trim();
  } else expenseData.category = selectedCategory.value;

  if (subExpense?.value.trim() !== "")
    expenseData.subExpense = subExpense.value.trim();

  console.log("Entered Expense Data:", expenseData);

  try {
    if (expenseId.value === "") {
      const response = await axios.post(
        "http://localhost:5000/api/expense",
        expenseData,
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Create Expense:", response.data.data);
      console.log("EXPENSE ADDED");
    } else {
      const response = await axios.post(
        `http://localhost:5000/api/expense/${expenseId.value}`,
        expenseData,
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Modified Expense:", response.data.data);
      console.log("EXPENSE EDITED");
    }
    resetForm();
    getExpenses();
  } catch (error) {
    console.log(error);
  }
}

const selectedCategory = document.getElementById("expense-category");
const customExpenseSection = document.getElementById("expense-category-custom");

// onChange Event on select element checks for option 'Others'
// if selected option is 'Others' then unhide custom category section
selectedCategory.addEventListener("change", () => {
  if (
    selectedCategory.options[selectedCategory.options.selectedIndex].text ===
    "Others"
  ) {
    customExpenseSection.hidden = false;
    console.log("Custom Category!");
  } else {
    customExpenseSection.hidden = true;
    console.log("Existing Category!");
  }
});

async function getExpenses() {
  try {
    const response = await axios.get("http://localhost:5000/api/expense", {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Get Expenses:", response.data.data);
    console.log("EXPENSES FETCHED");
    if (response.data.count !== 0) populateExpenses(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

function populateExpenses(expenses) {
  const expenseList = document.getElementById("expense-list");
  expenseList.innerText = "";

  const hElementExpenseList = document.createElement("h4");
  hElementExpenseList.innerText = "Expense List";
  hElementExpenseList.classList.add("mb-3", "mt-3");
  expenseList.appendChild(hElementExpenseList);

  const divElementListGroup = document.createElement("div");
  divElementListGroup.classList.add("card", "list-group");
  expenseList.appendChild(divElementListGroup);

  expenses.forEach((expense) => {
    const liElementListGroupItem = document.createElement("li");
    liElementListGroupItem.classList.add("expense-data", "list-group-item");
    divElementListGroup.appendChild(liElementListGroupItem);

    const divElementExpenseDataRow = document.createElement("div");
    divElementExpenseDataRow.classList.add(
      "expense-data-row",
      "list-group-item"
    );
    liElementListGroupItem.appendChild(divElementExpenseDataRow);

    const divElementColAmount = document.createElement("div");
    // divElementColAmount.classList.add("expense-data-col", "col-lg-2");
    divElementColAmount.classList.add("expense-data-col");
    divElementExpenseDataRow.appendChild(divElementColAmount);

    const spanElementColAmount = document.createElement("span");
    spanElementColAmount.classList.add(
      "expense-data-col__amount",
      "font-weight-bold"
    );
    spanElementColAmount.innerText = "Amount: ";
    divElementColAmount.appendChild(spanElementColAmount);
    divElementColAmount.appendChild(document.createTextNode(expense.amount));

    const divElementColStatement = document.createElement("div");
    // divElementColStatement.classList.add("expense-data-col", "col-lg-3");
    divElementColStatement.classList.add("expense-data-col");
    divElementExpenseDataRow.appendChild(divElementColStatement);

    const spanElementColStatement = document.createElement("span");
    spanElementColStatement.classList.add(
      "expense-data-col__statement",
      "font-weight-bold"
    );
    spanElementColStatement.innerText = "Title: ";
    divElementColStatement.appendChild(spanElementColStatement);
    divElementColStatement.appendChild(
      document.createTextNode(expense.statement)
    );

    const divElementColCategory = document.createElement("div");
    // divElementColCategory.classList.add("expense-data-col", "col-lg-2");
    divElementColCategory.classList.add("expense-data-col");

    divElementExpenseDataRow.appendChild(divElementColCategory);

    const spanElementColCategory = document.createElement("span");
    spanElementColCategory.classList.add(
      "expense-data-col__category",
      "font-weight-bold"
    );
    spanElementColCategory.innerText = "Category: ";
    divElementColCategory.appendChild(spanElementColCategory);
    divElementColCategory.appendChild(
      document.createTextNode(expense.category.categoryName)
    );

    const divElementColSubExpense = document.createElement("div");
    // divElementColSubExpense.classList.add("expense-data-col", "col-lg-2");
    divElementColSubExpense.classList.add("expense-data-col");
    divElementExpenseDataRow.appendChild(divElementColSubExpense);

    if (expense.subExpense) {
      const spanElementColSubExpense = document.createElement("span");
      spanElementColSubExpense.classList.add(
        "expense-data-col__sub-expense",
        "font-weight-bold"
      );
      spanElementColSubExpense.innerText = "Sub-Expense: ";
      divElementColSubExpense.appendChild(spanElementColSubExpense);
      divElementColSubExpense.appendChild(
        document.createTextNode(expense.subExpense)
      );
    }

    const divElementColCreatedAt = document.createElement("div");
    // divElementColCreatedAt.classList.add("expense-data-col", "col-lg-2");
    divElementColCreatedAt.classList.add("expense-data-col");

    divElementExpenseDataRow.appendChild(divElementColCreatedAt);

    const spanElementColCreatedAt = document.createElement("span");
    spanElementColCreatedAt.classList.add(
      "expense-data-col__created",
      "font-weight-bold"
    );
    spanElementColCreatedAt.innerText = "Created: ";
    divElementColCreatedAt.appendChild(spanElementColCreatedAt);
    divElementColCreatedAt.appendChild(
      document.createTextNode(expense.createdAt)
    );

    const divElementColButtons = document.createElement("div");
    divElementColButtons.classList.add("expense-data-col", "text-right");
    divElementExpenseDataRow.appendChild(divElementColButtons);

    const buttonElementEdit = document.createElement("button");
    buttonElementEdit.classList.add(
      "expense-data-col__edit-button",
      "btn",
      "btn-sm",
      "btn-info"
    );
    buttonElementEdit.innerText = "Edit";
    divElementColButtons.appendChild(buttonElementEdit);

    const buttonElementDelete = document.createElement("button");
    buttonElementDelete.classList.add(
      "expense-data-col__delete-button",
      "btn",
      "btn-sm",
      "btn-danger",
      "ml-2"
    );
    buttonElementDelete.innerText = "Delete";
    divElementColButtons.appendChild(buttonElementDelete);

    buttonElementEdit.addEventListener("click", () => {
      populateExpenseForEdit(expense);
    });

    buttonElementDelete.addEventListener("click", () => {
      deleteExpense(expense);
    });
  });
}

function populateExpenseForEdit(expense) {
  const expenseId = document.getElementById("expense-Id");
  const expenseTitle = document.getElementById("expense-title");
  const expenseAmount = document.getElementById("expense-amount");
  const selectedCategory = document.getElementById("expense-category");
  const subExpense = document.getElementById("expense-sub");

  expenseId.value = expense._id;
  expenseTitle.value = expense.statement;
  expenseAmount.value = expense.amount;
  selectedCategory.value = expense.category._id;
  if (expense.subExpense) subExpense.value = expense.subExpense;

  createEditExpenseButton.innerText = "Save Expense";
}

// Reset Button
const resetExpenseButton = document.getElementById("reset-expense-button");
resetExpenseButton.addEventListener("click", resetForm);

function resetForm() {
  const expenseId = document.getElementById("expense-Id");
  const expenseTitle = document.getElementById("expense-title");
  const expenseAmount = document.getElementById("expense-amount");
  const selectedCategory = document.getElementById("expense-category");
  const subExpense = document.getElementById("expense-sub");
  const customCategoryName = document.getElementById(
    "expense-category-custom-text"
  );

  expenseId.value = "";
  expenseTitle.value = "";
  expenseAmount.value = "";
  subExpense.value = "";
  customCategoryName.value = "";

  getCategories();
  selectedCategory.selectIndex = 0;

  createEditExpenseButton.innerText = "Add Expense";
}

async function deleteExpense(expense) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/expense/${expense._id}`,
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Delete Expenses:", response.data.data);
    console.log("EXPENSE DELETED");
    getExpenses();
  } catch (error) {
    console.log(error);
  }
}
