import test from 'node:test';
import assert from 'node:assert/strict';

import {
    generateProductAllocations,
} from '../services/recommendationService.js';


test(
    'should split asset-class allocation across selected products',
    () => {
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
                id: 2,
                assetClass: 'Equity',
            },
            {
                id: 3,
                assetClass: 'Fixed Income',
            },
            {
                id: 4,
                assetClass: 'Cash Equivalent',
            },
        ];

        const result =
            generateProductAllocations(
                portfolio,
                products
            );

        assert.deepEqual(
            result,
            [
                {
                    productId: 1,
                    assetClass: 'Equity',
                    investmentProportion: 25,
                },
                {
                    productId: 2,
                    assetClass: 'Equity',
                    investmentProportion: 25,
                },
                {
                    productId: 3,
                    assetClass: 'Fixed Income',
                    investmentProportion: 45,
                },
                {
                    productId: 4,
                    assetClass: 'Cash Equivalent',
                    investmentProportion: 5,
                },
            ]
        );
    }
);


test(
    'should preserve exact allocation when a percentage is not evenly divisible',
    () => {
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
                id: 2,
                assetClass: 'Equity',
            },
            {
                id: 3,
                assetClass: 'Equity',
            },
            {
                id: 4,
                assetClass: 'Fixed Income',
            },
            {
                id: 5,
                assetClass: 'Cash Equivalent',
            },
        ];

        const result =
            generateProductAllocations(
                portfolio,
                products
            );

        const equityAllocations =
            result
                .filter(
                    allocation =>
                        allocation.assetClass ===
                        'Equity'
                )
                .map(
                    allocation =>
                        allocation
                            .investmentProportion
                );

        assert.deepEqual(
            equityAllocations,
            [
                16.67,
                16.67,
                16.66,
            ]
        );
    }
);


test(
    'all generated allocations should sum to 100 percent',
    () => {
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
                id: 2,
                assetClass: 'Equity',
            },
            {
                id: 3,
                assetClass: 'Equity',
            },
            {
                id: 4,
                assetClass: 'Fixed Income',
            },
            {
                id: 5,
                assetClass: 'Cash Equivalent',
            },
        ];

        const result =
            generateProductAllocations(
                portfolio,
                products
            );

        const total =
            result.reduce(
                (
                    sum,
                    allocation
                ) =>
                    sum +
                    allocation
                        .investmentProportion,
                0
            );

        assert.equal(
            total,
            100
        );
    }
);


test(
    'should throw when a required asset class has no selected product',
    () => {
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
                id: 2,
                assetClass: 'Fixed Income',
            },
        ];

        assert.throws(
            () =>
                generateProductAllocations(
                    portfolio,
                    products
                ),
            /must be selected/
        );
    }
);