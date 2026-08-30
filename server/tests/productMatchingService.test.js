import test from 'node:test';
import assert from 'node:assert/strict';

import {
    isRiskCompatible,
    filterCompatibleProducts,
} from '../services/productMatchingService.js';


test(
    'Balanced user should accept Conservative product',
    () => {
        const result =
            isRiskCompatible(
                'Balanced',
                'Conservative'
            );

        assert.equal(
            result,
            true
        );
    }
);


test(
    'Balanced user should reject Growth product',
    () => {
        const result =
            isRiskCompatible(
                'Balanced',
                'Growth'
            );

        assert.equal(
            result,
            false
        );
    }
);


test(
    'user should accept product with same risk level',
    () => {
        const result =
            isRiskCompatible(
                'Balanced',
                'Balanced'
            );

        assert.equal(
            result,
            true
        );
    }
);


test(
    'filterCompatibleProducts should remove products above user risk level',
    () => {
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

        const result =
            filterCompatibleProducts(
                'Balanced',
                products
            );

        assert.equal(
            result.length,
            2
        );

        assert.deepEqual(
            result.map(
                product =>
                    product.id
            ),
            [1, 2]
        );
    }
);


test(
    'invalid user risk level should throw an error',
    () => {
        assert.throws(
            () =>
                isRiskCompatible(
                    'Unknown',
                    'Balanced'
                ),
            /Invalid user risk level/
        );
    }
);