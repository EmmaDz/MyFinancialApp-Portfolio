import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getPortfolioAllocation,
} from '../services/portfolioAllocationService.js';


const cases = [
    {
        riskLevel:
            'Very Conservative',
        expected: {
            riskLevel:
                'Very Conservative',
            equity: 15,
            fixedIncome: 65,
            cashEquivalent: 20,
        },
    },
    {
        riskLevel:
            'Conservative',
        expected: {
            riskLevel:
                'Conservative',
            equity: 30,
            fixedIncome: 60,
            cashEquivalent: 10,
        },
    },
    {
        riskLevel:
            'Balanced',
        expected: {
            riskLevel:
                'Balanced',
            equity: 50,
            fixedIncome: 45,
            cashEquivalent: 5,
        },
    },
    {
        riskLevel:
            'Growth',
        expected: {
            riskLevel:
                'Growth',
            equity: 70,
            fixedIncome: 25,
            cashEquivalent: 5,
        },
    },
    {
        riskLevel:
            'Aggressive Growth',
        expected: {
            riskLevel:
                'Aggressive Growth',
            equity: 85,
            fixedIncome: 10,
            cashEquivalent: 5,
        },
    },
];


for (const {
    riskLevel,
    expected,
} of cases) {
    test(
        `${riskLevel} should return the correct allocation`,
        () => {
            const result =
                getPortfolioAllocation(
                    riskLevel
                );

            assert.deepEqual(
                result,
                expected
            );
        }
    );
}


test(
    'every portfolio allocation should sum to 100 percent',
    () => {
        for (
            const { riskLevel }
            of cases
        ) {
            const allocation =
                getPortfolioAllocation(
                    riskLevel
                );

            const total =
                allocation.equity +
                allocation.fixedIncome +
                allocation.cashEquivalent;

            assert.equal(
                total,
                100
            );
        }
    }
);


test(
    'invalid risk level should throw an error',
    () => {
        assert.throws(
            () =>
                getPortfolioAllocation(
                    'Unknown'
                ),
            /Invalid risk level/
        );
    }
);