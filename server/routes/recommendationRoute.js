import express from 'express';

import authMiddleware
    from '../middleware/auth.js';

import {
    generateAndSaveRecommendation,
    getAllRecommendations,
} from '../controllers/recommendationController.js';


const recommendationRouter =
    express.Router();


recommendationRouter.post(
    '/generate',
    authMiddleware,
    generateAndSaveRecommendation
);


recommendationRouter.get(
    '/list',
    authMiddleware,
    getAllRecommendations
);


export default recommendationRouter;