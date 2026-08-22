import express from 'express';

import {
    createFinancialProduct,
    queryFinancialProducts,
    queryCompatibleFinancialProducts
} from '../controllers/financialProductController.js';

const financialProductRouter =
    express.Router();

financialProductRouter.get(
    '/compatible',
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