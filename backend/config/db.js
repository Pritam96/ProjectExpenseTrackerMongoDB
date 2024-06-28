const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to the database. Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
