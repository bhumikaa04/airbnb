const mongoose = require("mongoose");
const initData = require("./data"); // Ensure this file exports a valid data array
const Listing = require("../models/listing.js");

// MongoDB Connection Function
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
        console.log("DB is working.");

        // Initialize database after connection is established
        await initDB();
    } catch (err) {
        console.error("DB Connection Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

// Function to Initialize Database
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data has been initialized.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Call main function
main();
