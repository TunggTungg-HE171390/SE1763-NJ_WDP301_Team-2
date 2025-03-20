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

const findTestsByCategoryId = async (req, res, next) => {
  try {
    // Tìm tất cả các bài kiểm tra theo categoryId
    const tests = await Tests.find({ category: req.params.categoryId }).exec();

    if (tests.length === 0) {
      return res.status(404).json({ message: "No tests found for this category" });
    }

    // Tạo mảng chứa tất cả các testId
    const testIds = tests.map(test => test._id);

    // Tính số lượng câu hỏi cho tất cả các bài kiểm tra
    const questionCount = await Questions.countDocuments({ testId: { $in: testIds } }).exec();
    console.log("Question count:", questionCount);

    // Trả về kết quả
    res.json({
      data: {
        tests,         // Trả về danh sách bài kiểm tra
        questionCount  // Trả về số câu hỏi tổng cộng
      }
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
