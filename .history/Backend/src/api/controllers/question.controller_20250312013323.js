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

    return res.status(201).json({ message: "Questions created successfully", questions: savedQuestions });
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

const editMultipleAnswersById = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { updatedAnswers } = req.body; // Expecting an array of { answerId, newContent, newPoint }

    const question = await Questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!Array.isArray(updatedAnswers) || updatedAnswers.length === 0) {
      return res.status(400).json({ error: "updatedAnswers must be a non-empty array" });
    }

    // Lặp qua danh sách cần cập nhật
    updatedAnswers.forEach(({ answerId, newContent, newPoint }) => {
      const answer = question.answers.id(answerId);
      if (answer) {
        if (newContent) answer.content = newContent;
        if (typeof newPoint === "number") answer.point = newPoint;
      }
    });

    await question.save();

    return res.status(200).json({
      message: "Answers updated successfully",
      question,
    });
  } catch (error) {
    next(error);
  }
};


export default {
  findQuestionsById,
  getQuestionsOnTest,
  insertQuestionOnTest,
  checkIfTestHasQuestions,
  editMultipleAnswersById
};
