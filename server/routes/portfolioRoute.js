import express from 'express';

import authMiddleware
    from '../middleware/auth.js';

import {
    submitPortfolio,
    getPortfolioByUserId,
} from '../controllers/portfolioController.js';


const portfolioRouter =
    express.Router();


portfolioRouter.post(
    '/',
    authMiddleware,
    submitPortfolio
);


portfolioRouter.get(
    '/fetchPortfolio',
    authMiddleware,
    getPortfolioByUserId
);


export default portfolioRouter;