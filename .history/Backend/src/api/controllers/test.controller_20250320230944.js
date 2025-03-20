import Tests from "../models/test.model.js";
import Questions from "../models/question.model.js";
const findTestsById = async (req, res, next) => {
  try {
    const test = await Tests.findById(req.params.testId)
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
    const { title, description, testOutcomes } = req.body;
    const category = req.params.categoryId;

    if (!title || !description || !testOutcomes || !Array.isArray(testOutcomes)) {
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

    res.status(201).json({ message: "Test created successfully", test: savedTest._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const deletedTest = await Tests.findByIdAndDelete(req.params.testId);
    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    const questions = await Questions.deleteMany({ testId: req.params.testId });

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    // Extract title, description, testOutcomes from req.body
    const { title, description, testOutcomes } = req.body;
    console.log("title", title); 
    console.log("title", typeof title);
    // Ensure title is a string
    if (typeof title !== 'string') {
      return res.status(400).json({ error: "Title must be a string" });
    }

    console.log("title", typeof title);

    // Update the test in the database
    const updatedTest = await Tests.findByIdAndUpdate(
      testId,
      { title, description, testOutcomes },
      { new: true } // Return the updated document
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  findTestsById,
  createTest,
  deleteTest,
  updateTest,
};
