import {
    generateProductAllocations,
} from './services/recommendationService.js';


const portfolio = {
    equity: 50,
    fixedIncome: 45,
    cashEquivalent: 5,
};


const products = [
    {
        id: 1,
        assetClass: 'Equity',
    },
    {
        id: 5,
        assetClass: 'Fixed Income',
    },
    {
        id: 99,
        assetClass: 'Crypto'
    }
];


const recommendations =
    generateProductAllocations(
        portfolio,
        products
    );


console.log(recommendations);


const total =
    recommendations.reduce(
        (
            sum,
            recommendation
        ) =>
            sum +
            recommendation
                .investmentProportion,
        0
    );


console.log(
    'Total:',
    total
);