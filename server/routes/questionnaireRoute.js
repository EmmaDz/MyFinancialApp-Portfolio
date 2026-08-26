import express from "express";
import authMiddleware
    from '../middleware/auth.js';
import { submitQuiz, getRiskLevel } from "../controllers/questionnaireController.js";
const riskManageRouter = express.Router();

riskManageRouter.post("/submit-quiz", authMiddleware, submitQuiz);
riskManageRouter.get('/risk-level', authMiddleware, getRiskLevel);

export default riskManageRouter;
