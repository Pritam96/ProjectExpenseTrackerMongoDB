const enteredEmail = document.getElementById("email");
const enteredPassword = document.getElementById("password");
const loginButton = document.getElementById("login-button");

if (loginButton && enteredEmail && enteredPassword)
  loginButton.addEventListener("click", async () => {
    if (enteredEmail.value === "" || enteredPassword.value === "") {
      alert("Missing required fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: enteredEmail.value.trim().toLowerCase(),
          password: enteredPassword.value.trim(),
        }
      );
      alert("Login is successful");
      localStorage.setItem("token", response.data.token);
      window.location.href = "./index.html";
    } catch (error) {
      alert("Invalid Credentials");
      window.location.href("./login.html");
    }
  });

const registerButton = document.getElementById("register-button");
const enteredUsername = document.getElementById("username");
const enteredPhoneNumber = document.getElementById("phone");

if (
  registerButton &&
  enteredEmail &&
  enteredPassword &&
  enteredUsername &&
  enteredPhoneNumber
)
  registerButton.addEventListener("click", async () => {
    if (
      enteredEmail.value === "" ||
      enteredPassword.value === "" ||
      enteredUsername.value === "" ||
      enteredPhoneNumber.value === ""
    ) {
      alert("Missing required fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: enteredEmail.value.trim().toLowerCase(),
          password: enteredPassword.value.trim(),
          username: enteredUsername.value.trim(),
          phoneNumber: enteredPhoneNumber.value.trim(),
        }
      );
      alert("Registration is successful");
      localStorage.setItem("token", response.data.token);
      window.location.href = "./index.html";
    } catch (error) {
      alert("Invalid Credentials");
      window.location.href("./login.html");
    }
  });
