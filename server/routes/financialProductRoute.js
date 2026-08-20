import express from 'express';

import {
    createFinancialProduct,
    queryFinancialProducts,
} from '../controllers/financialProductController.js';

const financialProductRouter =
    express.Router();

financialProductRouter.get(
    '/',
    queryFinancialProducts
);

financialProductRouter.post(
    '/',
    createFinancialProduct
);

export default financialProductRouter;