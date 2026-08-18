const MODEL_PORTFOLIO_ALLOCATIONS = {
    'Very Conservative': {
        equity: 15,
        fixedIncome: 65,
        cashEquivalent: 20,
    },

    Conservative: {
        equity: 30,
        fixedIncome: 60,
        cashEquivalent: 10,
    },

    Balanced: {
        equity: 50,
        fixedIncome: 45,
        cashEquivalent: 5,
    },

    Growth: {
        equity: 70,
        fixedIncome: 25,
        cashEquivalent: 5,
    },

    'Aggressive Growth': {
        equity: 85,
        fixedIncome: 10,
        cashEquivalent: 5,
    },
};


/*
 * Illustrative model portfolio allocations used for this
 * educational application.
 *
 * Risk-profile categories are aligned with the questionnaire
 * workflow, but these specific asset-allocation percentages
 * are application-defined model portfolios.
 */
export function getPortfolioAllocation(riskLevel) {
    const allocation =
        MODEL_PORTFOLIO_ALLOCATIONS[riskLevel];

    if (!allocation) {
        throw new Error(
            `Invalid risk level: ${riskLevel}`
        );
    }

    return {
        riskLevel,
        ...allocation,
    };
}