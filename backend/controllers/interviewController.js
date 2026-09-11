const Interview = require("../models/Interview");
const interviewQuestions = require("../data/interviewQuestions");

// Get a random interview question
const getInterviewQuestion = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    let questions = interviewQuestions;

    if (category) {
      questions = questions.filter(
        (q) => q.category === category
      );
    }

    if (difficulty) {
      questions = questions.filter(
        (q) => q.difficulty === difficulty
      );
    }

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    res.status(200).json({
      success: true,
      question: randomQuestion,
    });
  } catch (error) {
    console.error("Get Interview Question Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load interview question",
    });
  }
};


// Evaluate student's answer
const evaluateAnswer = async (req, res) => {
  try {
    const {
      student,
      category,
      difficulty,
      question,
      answer,
    } = req.body;

    if (
      !student ||
      !category ||
      !question ||
      !answer
    ) {
      return res.status(400).json({
        success: false,
        message: "Required interview data is missing",
      });
    }

    const cleanAnswer = answer.trim();

    if (cleanAnswer.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a more detailed answer.",
      });
    }

    // Basic AI-style evaluation
    let score = 30;

    const answerLength = cleanAnswer.length;

    if (answerLength >= 50) {
      score += 15;
    }

    if (answerLength >= 100) {
      score += 15;
    }

    if (answerLength >= 200) {
      score += 10;
    }

    // Look for meaningful explanation keywords
    const usefulWords = [
      "because",
      "example",
      "experience",
      "project",
      "solution",
      "problem",
      "result",
      "learned",
      "used",
      "explain",
      "important",
      "advantage",
      "difference",
    ];

    const lowerAnswer = cleanAnswer.toLowerCase();

    const matchedWords = usefulWords.filter(
      (word) => lowerAnswer.includes(word)
    );

    score += Math.min(
      matchedWords.length * 3,
      15
    );

    score = Math.min(score, 100);

    let feedback = "";

    if (score >= 85) {
      feedback =
        "Excellent answer. Your response is detailed, clear and relevant. Try to maintain this level of confidence in the actual interview.";
    } else if (score >= 70) {
      feedback =
        "Good answer. Your response is relevant, but you can improve it by adding a practical example and explaining your points more clearly.";
    } else if (score >= 50) {
      feedback =
        "Average answer. Try to give more details, examples and explain your reasoning instead of giving a short response.";
    } else {
      feedback =
        "Your answer needs improvement. Try to understand the question carefully and provide a clear explanation with an example.";
    }

    const interview = await Interview.create({
      student,
      category,
      question,
      answer: cleanAnswer,
      difficulty: difficulty || "Easy",
      score,
      feedback,
      isCompleted: true,
    });

    res.status(201).json({
      success: true,
      message: "Answer evaluated successfully",
      score,
      feedback,
      interview,
    });
  } catch (error) {
    console.error("Evaluate Interview Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to evaluate answer",
    });
  }
};


// Get student's interview history
const getInterviewHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const interviews = await Interview.find({
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    const total = interviews.length;

    const averageScore =
      total > 0
        ? Math.round(
            interviews.reduce(
              (sum, interview) =>
                sum + interview.score,
              0
            ) / total
          )
        : 0;

    res.status(200).json({
      success: true,
      count: total,
      averageScore,
      interviews,
    });
  } catch (error) {
    console.error(
      "Interview History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load interview history",
    });
  }
};


// Delete student's interview history
const deleteInterviewHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    await Interview.deleteMany({
      student: studentId,
    });

    res.status(200).json({
      success: true,
      message: "Interview history deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Interview History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete interview history",
    });
  }
};


module.exports = {
  getInterviewQuestion,
  evaluateAnswer,
  getInterviewHistory,
  deleteInterviewHistory,
};