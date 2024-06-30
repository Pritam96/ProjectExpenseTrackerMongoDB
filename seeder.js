const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config({ path: "./backend/config/config.env" });

const Category = require("./backend/models/Category");

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/_data/categories.json`, "utf-8")
);

// Import data
const importData = async () => {
  try {
    await Category.create(categories);
    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Category.deleteMany();
    console.log("Data Deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Command line arguments
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
