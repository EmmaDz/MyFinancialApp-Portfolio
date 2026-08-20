import FinancialProduct
    from './financialProductModel.js';

import Recommendation
    from './recommendationModel.js';


Recommendation.belongsTo(
    FinancialProduct,
    {
        foreignKey: 'productId',
        as: 'product',
    }
);


FinancialProduct.hasMany(
    Recommendation,
    {
        foreignKey: 'productId',
        as: 'recommendations',
    }
);