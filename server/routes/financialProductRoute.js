import express from 'express';
import authMiddleware
    from '../middleware/auth.js';
import {
    createFinancialProduct,
    queryFinancialProducts,
    queryCompatibleFinancialProducts
} from '../controllers/financialProductController.js';

const financialProductRouter =
    express.Router();

financialProductRouter.get(
    '/compatible',
    authMiddleware,
    queryCompatibleFinancialProducts
);

financialProductRouter.get(
    '/',
    queryFinancialProducts
);

financialProductRouter.post(
    '/',
    createFinancialProduct
);

export default financialProductRouter;