import Categories from "../models/category.model.js";
import Tests from "../models/test.model.js";
import Questions from "../models/question.model.js";

const findAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error);
  }
};

const findTestsByCategoyId = async (req, res, next) => {
  try {
    const tests = await Tests.find({ category: req.params.categoryId }).exec();

    if (tests.length === 0) {
      return res.status(404).json({ message: "No tests found for this category" });
    }

    // Tính số câu hỏi cho từng bài kiểm tra
    const testsWithQuestionCount = await Promise.all(tests.map(async (test) => {
      const questionCount = await Questions.countDocuments({ testId: test._id }).exec();
      return {
        ...test.toObject(), // Chuyển test thành đối tượng thông thường
        questionCount,      // Thêm questionCount vào mỗi bài kiểm tra
      };
    }));

    // Trả về kết quả
    res.json({
      data: testsWithQuestionCount
    });
  } catch (error) {
    console.error("Error fetching tests: ", error);
    next(error);
  }
};

const getCateNameByCateId = async (req, res, next) => {
  try {
    const category = await Categories.findById(req.params.categoryId).exec();
    res.json({ categoryName: category.categoryName });
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error);
  }
};

export default {
  findAllCategories,
  findTestsByCategoyId,
  getCateNameByCateId
};
