const mongoose = require("mongoose");
const CategorySchema = require("../../database/schema/CategorySchema.js");

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
