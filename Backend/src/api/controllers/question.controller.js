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
    const questions = await Questions.find({ testId: req.params.testId })
      .populate("testId", "title -_id")
      .populate("category", "categoryName -_id")
      .exec();;
    res.json({
      testTitle: questions[0]?.testId?.title, 
      category: questions[0]?.category?.categoryName,
      questions: questions.map((q) => {
        return {
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
      const checkTest = await Test.findById(req.params.testId);
      if (!checkTest) {
          return res.status(404).json({ error: "Test not found" });
      }

      const { questions } = req.body;

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

export default {
  findQuestionsById,
  getQuestionsOnTest,
  insertQuestionOnTest
};
