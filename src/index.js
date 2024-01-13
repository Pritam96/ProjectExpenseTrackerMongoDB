const token = localStorage.getItem("token");
let currentUser;

if (!token) {
  alert("Token is missing");
  window.location.replace("./login.html");
}

document.addEventListener("DOMContentLoaded", (event) => {
  getCategories();
  currentUser = getCurrentUser();
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

const createExpenseButton = document.getElementById("add-expense-button");
createExpenseButton.addEventListener("click", async () => {
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

  if (customCategoryName) {
    expenseData.newCategoryName = customCategoryName?.value.trim();
  } else expenseData.category = selectedCategory.value;

  if (subExpense?.value.trim() !== "")
    expenseData.subExpense = subExpense.value.trim();

  console.log("Entered Expense Data:", expenseData);

  try {
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
  } catch (error) {
    console.log(error);
  }
});

const selectedCategory = document.getElementById("expense-category");
const customExpenseSection = document.getElementById("expense-category-custom");

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
