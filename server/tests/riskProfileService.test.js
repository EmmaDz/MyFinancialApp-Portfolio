import test from 'node:test';
import assert from 'node:assert/strict';

import {
    calculateRiskProfile,
} from '../services/riskProfileService.js';


const highRiskAnswers = {
    Q1: 'E',
    Q2: 'C',
    Q3: 'D',

    Q4: 'F',
    Q5: 'A',
    Q6: 'E',
    Q7: 'F',
    Q8: 'A',
    Q9: 'A',

    Q10: 'D',
    Q11: 'E',
    Q12: 'D',
    Q13: 'D',
    Q14: 'D',
    Q15: 'D',
};

test(
    'high-risk answers should produce Aggressive Growth profile',
    () => {
        const result =
            calculateRiskProfile(
                highRiskAnswers
            );

        assert.deepEqual(
            result,
            {
                riskLevel:
                    'Aggressive Growth',

                timeHorizonProfile:
                    'Aggressive Growth',

                investmentKnowledgeProfile:
                    'Aggressive Growth',

                investmentObjectiveProfile:
                    'Aggressive Growth',

                riskCapacityScore:
                    68,

                riskCapacityProfile:
                    'Aggressive Growth',

                riskToleranceScore:
                    60,

                riskToleranceProfile:
                    'Aggressive Growth',
            }
        );
    }
);

test(
    'most conservative dimension should determine final risk level',
    () => {
        const answers = {
            ...highRiskAnswers,
            Q1: 'B',
        };

        const result =
            calculateRiskProfile(
                answers
            );

        assert.equal(
            result.timeHorizonProfile,
            'Conservative'
        );

        assert.equal(
            result.riskLevel,
            'Conservative'
        );
    }
);

test(
    'risk tolerance can become the limiting dimension',
    () => {
        const answers = {
            ...highRiskAnswers,

            Q10: 'A',
            Q11: 'A',
            Q12: 'A',
            Q13: 'A',
            Q14: 'A',
            Q15: 'A',
        };

        const result =
            calculateRiskProfile(
                answers
            );

        assert.equal(
            result.riskToleranceScore,
            0
        );

        assert.equal(
            result.riskToleranceProfile,
            'Very Conservative'
        );

        assert.equal(
            result.riskLevel,
            'Very Conservative'
        );
    }
);

test(
    'risk capacity score should map to Balanced profile',
    () => {
        const answers = {
            ...highRiskAnswers,

            Q4: 'C',
            Q5: 'B',
            Q6: 'C',
            Q7: 'C',
            Q8: 'C',
            Q9: 'C',
        };

        const result =
            calculateRiskProfile(
                answers
            );

        assert.equal(
            result.riskCapacityScore,
            24
        );

        assert.equal(
            result.riskCapacityProfile,
            'Balanced'
        );

        assert.equal(
            result.riskLevel,
            'Balanced'
        );
    }
);

test(
    'risk tolerance score should map to Balanced profile',
    () => {
        const answers = {
            ...highRiskAnswers,

            Q10: 'C',
            Q11: 'C',
            Q12: 'C',
            Q13: 'C',
            Q14: 'C',
            Q15: 'A',
        };

        const result =
            calculateRiskProfile(
                answers
            );

        assert.equal(
            result.riskToleranceScore,
            29
        );

        assert.equal(
            result.riskToleranceProfile,
            'Balanced'
        );

        assert.equal(
            result.riskLevel,
            'Balanced'
        );
    }
);

test(
    'missing questionnaire answer should throw an error',
    () => {
        const answers = {
            ...highRiskAnswers,
        };

        delete answers.Q7;

        assert.throws(
            () =>
                calculateRiskProfile(
                    answers
                ),
            /Missing answer for Q7/
        );
    }
);

test(
    'invalid answer in Q1-Q3 should throw an error',
    () => {
        const answers = {
            ...highRiskAnswers,
            Q1: 'Z',
        };

        assert.throws(
            () =>
                calculateRiskProfile(
                    answers
                ),
            /Invalid answer in questions Q1-Q3/
        );
    }
);

test(
    'invalid scored-question answer should throw an error',
    () => {
        const answers = {
            ...highRiskAnswers,
            Q10: 'Z',
        };

        assert.throws(
            () =>
                calculateRiskProfile(
                    answers
                ),
            /Invalid or missing answer for Q10/
        );
    }
);