import mongoose, { Schema } from "mongoose";

// Category schema
const CategorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true, // Category name is required
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Category model
const Category = mongoose.model("Category", CategorySchema);

export default Category;
