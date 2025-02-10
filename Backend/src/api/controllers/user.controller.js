import Users from "../models/user.model.js";

const findAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error); 
  }
};

export default { 
  findAllUsers 
};
