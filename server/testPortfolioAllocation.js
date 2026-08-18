import {
    getPortfolioAllocation
} from './services/portfolioAllocationService.js';


const profiles = [
    'Very Conservative',
    'Conservative',
    'Balanced',
    'Growth',
    'Aggressive Growth',
];


for (const profile of profiles) {
    const allocation =
        getPortfolioAllocation(profile);

    const total =
        allocation.equity +
        allocation.fixedIncome +
        allocation.cashEquivalent

    console.log('\nRisk Profile:', profile);
    console.log(allocation);
    console.log('Total:', total);
}

try {
    getPortfolioAllocation('Super Aggressive');
} catch (error) {
    console.error(
        '\nExpected error:',
        error.message
    );
}