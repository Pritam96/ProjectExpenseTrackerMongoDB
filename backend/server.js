const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { errorHandler, notFound } = require("./middleware/errorHandler");

const connectDB = require("./config/db");

dotenv.config({ path: "./backend/config/config.env" });

connectDB();

const auth = require("./routes/auth");
const category = require("./routes/category");
const expense = require("./routes/expense");
const payment = require("./routes/payment");
const leaderboard = require("./routes/leaderboard");
const report = require("./routes/report");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/category", category);
app.use("/api/expense", expense);
app.use("/api/payment", payment);
app.use("/api/leaderboard", leaderboard);
app.use("/api/report", report);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
