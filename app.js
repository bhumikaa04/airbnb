const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");  // ✅ Import Joi

const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Connection
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
        console.log("DB is working.");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}

main();

// Routes
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

app.get("/listings/new", wrapAsync((req, res) => {
    res.render("listings/new.ejs");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
}));

// Create Route with Validation
app.post("/listings", wrapAsync(async (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    }
    let { id } = req.params;
    let updatedData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted successfully!");
    res.redirect("/listings");
}));

// 404 Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { statusCode, message });
});


app.listen(port , (req, res)=> {
    console.log("Server is running on port 8080");
})