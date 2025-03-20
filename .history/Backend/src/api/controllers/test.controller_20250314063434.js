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
    // Lấy title, description, testOutcomes từ req.body
    const { title, description, testOutcomes } = req.body;

    console.log("testOutcomes", testOutcomes);  

    // Cập nhật bài kiểm tra trong cơ sở dữ liệu
    const updatedTest = await Tests.findByIdAndUpdate(
      req.params.testId,
      { title, description, testOutcomes },
      { new: true } // Trả về bản cập nhật mới
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
