import Tests from "../models/test.model.js";
import TestHistory from "../models/testHistory.model.js";
import Question from "../models/question.model.js";
const getUserAnswerForQuestion = async (req, res, next) => {
        try {
          const { userId, testId } = req.params;
      
          const testHistory = await TestHistory.findOne({ userId, testId })
          .populate("userId", "fullName -_id")
          .populate("testId", "title -_id")
          .exec();
      
          if (!testHistory) {
            return res.status(404).json({ message: "Không tìm thấy bài kiểm tra." });
          }
      
          // 2. Lấy danh sách questionId từ TestHistory
          const questionIds = testHistory.questions.map(q => q.questionId);
      
          // 3. Truy vấn chi tiết câu hỏi từ bảng Question
          const questions = await Question.find({ _id: { $in: questionIds } });
      
          const response = testHistory.questions.map(qh => {
            const questionDetail = questions.find(q => q._id.equals(qh.questionId)) || {};
            return {
              questionId: qh.questionId,
              content: questionDetail.content , 
              selectedAnswer: qh.selectedAnswer,
            };
          });
      
          res.json({ 
            userName: testHistory.userId.fullName, 
            testTitle: testHistory.testId.title, 
            questions: response 
        });
      
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ message: "Lỗi server." });
        }
      };

      const submitTest = async (req, res, next) => {
        try {
            const { userId, testId } = req.params;
            const { answers } = req.body;
    
            const newTestHistory = new TestHistory({
                userId,
                testId,
                questions: answers.map(answer => ({
                    questionId: answer.questionId,
                    selectedAnswer: { 
                        answer: answer.selectedAnswer 
                    }
                })),
                score: 0,
            });
    
            const savedTestHistory = await newTestHistory.save();
    
            const totalScore = await calculateScore(savedTestHistory, answers);
    
            const resultText = await getTestOutcome(totalScore, testId);
    
            savedTestHistory.score = totalScore;
            await savedTestHistory.save();
    
            res.json({
                userName: savedTestHistory.userId.fullName,
                testTitle: savedTestHistory.testId.title,
                score: totalScore,
                result: resultText,
                questions: savedTestHistory.questions
            });
    
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    };
    
    const calculateScore = async (testHistory, answers) => {
      const questionIds = testHistory.questions.map(q => q.questionId);
      const questions = await Question.find({ _id: { $in: questionIds } });
  
      let totalScore = 0;
  
      // Duyệt qua các câu trả lời của người dùng
      answers.forEach(answer => {
          const question = questions.find(q => q._id.equals(answer.questionId));
          if (question) {
              const correctAnswer = question.answers.find(a => a.content === answer.selectedAnswer);
              if (correctAnswer) {
                  totalScore += correctAnswer.point;  // Cộng điểm cho câu trả lời đúng
              }
          }
      });
  
      return totalScore;
  };
  

  
  const getTestOutcome = async (totalScore, testId) => {
    const test = await Test.findById(testId);  // Lấy thông tin bài kiểm tra từ testId
    const testOutcomes = test.testOutcomes;

    let resultText = "Không xác định";  // Biến lưu kết quả

    // Duyệt qua các testOutcome để xác định kết quả
    for (const outcome of testOutcomes) {
        if (totalScore >= outcome.minScore && totalScore <= outcome.maxScore) {
            resultText = outcome.description;
            break;
        }
    }

    return resultText;
};


export default { 
    getUserAnswerForQuestion,
    submitTest
};
