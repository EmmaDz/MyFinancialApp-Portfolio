import express from 'express';
import {
    createFinancialProduct,
    queryFinancialProductsByType,
    queryFinancialProductsByTypes
} from '../controllers/financialProductController.js';

const financialProductRouter = express.Router();

financialProductRouter.post("/create", createFinancialProduct);
financialProductRouter.get("/queryByType", queryFinancialProductsByType);
financialProductRouter.get("/queryByTypes", queryFinancialProductsByTypes);

export default financialProductRouter;