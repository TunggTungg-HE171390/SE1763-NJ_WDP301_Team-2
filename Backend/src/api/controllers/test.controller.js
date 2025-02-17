import Tests from "../models/test.model.js";
const findTestsById = async (req, res, next) => {
  try {
    const test = await Tests.findById(req.params.id)
    .populate("category", "categoryName -_id") 
    .exec(); 
    res.json(test);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error); 
  }
};

const createTest = async (req, res) => {
    try {
        const { title, category, description, testOutcomes } = req.body;

        if (!title || !category || !description || !testOutcomes || !Array.isArray(testOutcomes)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log("testOutcomes", testOutcomes);

        const newTest = new Tests({
            title,
            category,
            description,
            testOutcomes,
        });

        const savedTest = await newTest.save();

        res.status(201).json({ message: "Test created successfully", test: savedTest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { 
    findTestsById,
    createTest,
};
