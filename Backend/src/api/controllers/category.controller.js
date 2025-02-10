import Categories from "../models/category.model.js";

const findAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error); 
  }
};

export default { 
    findAllCategories 
};
