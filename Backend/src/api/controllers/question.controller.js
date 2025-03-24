import Questions from "../models/question.model.js";
import Test from "../models/test.model.js";
const findQuestionsById = async (req, res, next) => {
  try {
    const contentQuestion = await Questions.findById(req.params.id)
      .populate("testId", "title -_id")
      .populate("category", "categoryName -_id")
      .exec();
    res.json(contentQuestion);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error);
  }
};

const getQuestionsOnTest = async (req, res, next) => {
  try {
    console.log("Test ID received:", req.params.testId);

    const questions = await Questions.find({ testId: req.params.testId })
      .populate("testId", "title -_id")
      .populate("category", "categoryName -_id")
      .exec();;
    res.json({
      testTitle: questions[0]?.testId?.title,
      category: questions[0]?.category?.categoryName,
      questionCount: questions.length,
      questions: questions.map((q) => {
        return {
          questionId: q._id,
          content: q.content,
          answers: q.answers,
        };
      })
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error);
  }
};

const insertQuestionOnTest = async (req, res, next) => {
  try {
    const { questions } = req.body;
    console.log("Type of questions:", typeof questions);

    const checkTest = await Test.findById(req.params.testId);

    if (!checkTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Questions must be an array and cannot be empty" });
    }

    const questionDocs = [];

    for (const q of questions) {
      if (!q.content || !Array.isArray(q.answers) || q.answers.length === 0) {
        return res.status(400).json({ error: "Each question must have content and answers" });
      }

      const questionDoc = {
        testId: req.params.testId,
        content: q.content,
        category: checkTest.category,
        answers: q.answers,
      };

      const validAnswers = questionDoc.answers.every(answer => answer.content && answer.point !== undefined);
      if (!validAnswers) {
        return res.status(400).json({ error: "Each answer must have content and point" });
      }

      questionDocs.push(questionDoc);
    }

    const savedQuestions = await Questions.insertMany(questionDocs);

    const questionIds = savedQuestions.map((q) => q._id);

    return res.status(201).json({ message: "Questions created successfully", questionIds });
  } catch (error) {
    next(error);
  }
};

const checkIfTestHasQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({ testId: req.params.testId });

    if (questions.length === 0) {
      return res.status(200).json({ hasQuestions: false, message: "Bài kiểm tra này không có câu hỏi" });
    }
    return res.status(200).json({ hasQuestions: true, message: "Bài kiểm tra có câu hỏi" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Không tìm thấy bài kiểm tra" });
  }
};

const updateAllAnswers = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { questionContent, newAnswers } = req.body; // Expecting an array of { content, point }

    if (!Array.isArray(newAnswers) || newAnswers.length === 0) {
      return res.status(400).json({ error: "Answers must be a non-empty array" });
    }

    const question = await Questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    question.content = questionContent;
    // Gán lại toàn bộ mảng answers
    question.answers = newAnswers;
    await question.save();

    return res.status(200).json({
      message: "Answers updated successfully",
      question,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const deletedQuestion = await Questions.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getCountQuestionOnTheTest = async (req, res, next) => {
  try {
    console.log("Test ID received:", req.params.testId);
    const countQuestion = await Questions.find({ testId: req.params.testId }).countDocuments();
    res.json({
      count: countQuestion,
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error);
  }
}

export default {
  findQuestionsById,
  getQuestionsOnTest,
  insertQuestionOnTest,
  checkIfTestHasQuestions,
  updateAllAnswers,
  deleteQuestion,
  getCountQuestionOnTheTest,
};


