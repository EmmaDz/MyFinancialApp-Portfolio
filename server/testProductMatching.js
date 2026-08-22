import {
    isRiskCompatible,
    filterCompatibleProducts,
} from './services/productMatchingService.js';


console.log(
    'Balanced + Conservative:',
    isRiskCompatible(
        'Balanced',
        'Conservative'
    )
);

console.log(
    'Balanced + Growth:',
    isRiskCompatible(
        'Balanced',
        'Growth'
    )
);


const products = [
    {
        id: 1,
        name: 'Low Risk Product',
        riskLevel:
            'Very Conservative',
    },
    {
        id: 2,
        name: 'Balanced Product',
        riskLevel:
            'Balanced',
    },
    {
        id: 3,
        name: 'Growth Product',
        riskLevel:
            'Growth',
    },
];


const compatibleProducts =
    filterCompatibleProducts(
        'Balanced',
        products
    );


console.log(
    '\nCompatible products:'
);

console.log(
    compatibleProducts
);