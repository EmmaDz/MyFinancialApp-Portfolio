const PROFILE_RANK = {
    'Very Conservative': 1,
    Conservative: 2,
    Balanced: 3,
    Growth: 4,
    'Aggressive Growth': 5,
};

const PROFILE_BY_RANK = {
    1: 'Very Conservative',
    2: 'Conservative',
    3: 'Balanced',
    4: 'Growth',
    5: 'Aggressive Growth',
};


// --------------------------------------------------
// Questions 1-3
// These questions directly map to an investor profile.
// --------------------------------------------------

const TIME_HORIZON_PROFILE = {
    A: 'Very Conservative',
    B: 'Conservative',
    C: 'Growth',
    D: 'Growth',
    E: 'Aggressive Growth',
};

const INVESTMENT_KNOWLEDGE_PROFILE = {
    A: 'Balanced',
    B: 'Growth',
    C: 'Aggressive Growth',
};

const INVESTMENT_OBJECTIVE_PROFILE = {
    A: 'Very Conservative',
    B: 'Conservative',
    C: 'Balanced',
    D: 'Aggressive Growth',
};


// --------------------------------------------------
// Questions 4-9: Risk Capacity
// --------------------------------------------------

const RISK_CAPACITY_SCORES = {
    Q4: {
        A: 0,
        B: 2,
        C: 4,
        D: 5,
        E: 7,
        F: 10,
    },

    Q5: {
        A: 8,
        B: 4,
        C: 1,
    },

    Q6: {
        A: 0,
        B: 2,
        C: 5,
        D: 7,
        E: 10,
    },

    Q7: {
        A: 0,
        B: 2,
        C: 4,
        D: 6,
        E: 8,
        F: 10,
    },

    Q8: {
        A: 10,
        B: 5,
        C: 4,
        D: 2,
    },

    Q9: {
        A: 20,
        B: 8,
        C: 3,
        D: 1,
    },
};


// --------------------------------------------------
// Questions 10-15: Risk Tolerance
// --------------------------------------------------

const RISK_TOLERANCE_SCORES = {
    Q10: {
        A: 0,
        B: 4,
        C: 6,
        D: 10,
    },

    Q11: {
        A: 0,
        B: 3,
        C: 6,
        D: 8,
        E: 10,
    },

    Q12: {
        A: 0,
        B: 3,
        C: 6,
        D: 10,
    },

    Q13: {
        A: 0,
        B: 3,
        C: 6,
        D: 10,
    },

    Q14: {
        A: 0,
        B: 3,
        C: 5,
        D: 10,
    },

    Q15: {
        A: 0,
        B: 4,
        C: 6,
        D: 10,
    },
};


function calculateScore(answers, scoreMapping) {
    return Object.entries(scoreMapping).reduce(
        (total, [question, options]) => {
            const answer = answers[question];

            if (
                !answer ||
                !Object.prototype.hasOwnProperty.call(options, answer)
            ) {
                throw new Error(`Invalid or missing answer for ${question}`);
            }

            return total + options[answer];
        },
        0
    );
}


function getRiskCapacityProfile(score) {
    if (score < 15) {
        return 'Conservative';
    }

    if (score <= 25) {
        return 'Balanced';
    }

    if (score <= 40) {
        return 'Growth';
    }

    return 'Aggressive Growth';
}


function getRiskToleranceProfile(score) {
    if (score < 20) {
        return 'Very Conservative';
    }

    if (score <= 24) {
        return 'Conservative';
    }

    if (score <= 30) {
        return 'Balanced';
    }

    if (score <= 45) {
        return 'Growth';
    }

    return 'Aggressive Growth';
}


function getMostConservativeProfile(profiles) {
    const ranks = profiles.map(profile => PROFILE_RANK[profile]);

    if (ranks.some(rank => !rank)) {
        throw new Error('Invalid investor profile');
    }

    const lowestRank = Math.min(...ranks);

    return PROFILE_BY_RANK[lowestRank];
}


export function calculateRiskProfile(answers) {
    const requiredQuestions = Array.from(
        { length: 15 },
        (_, index) => `Q${index + 1}`
    );

    for (const question of requiredQuestions) {
        if (!answers[question]) {
            throw new Error(`Missing answer for ${question}`);
        }
    }

    const timeHorizonProfile =
        TIME_HORIZON_PROFILE[answers.Q1];

    const investmentKnowledgeProfile =
        INVESTMENT_KNOWLEDGE_PROFILE[answers.Q2];

    const investmentObjectiveProfile =
        INVESTMENT_OBJECTIVE_PROFILE[answers.Q3];

    if (
        !timeHorizonProfile ||
        !investmentKnowledgeProfile ||
        !investmentObjectiveProfile
    ) {
        throw new Error('Invalid answer in questions Q1-Q3');
    }

    const riskCapacityScore = calculateScore(
        answers,
        RISK_CAPACITY_SCORES
    );

    const riskToleranceScore = calculateScore(
        answers,
        RISK_TOLERANCE_SCORES
    );

    const riskCapacityProfile =
        getRiskCapacityProfile(riskCapacityScore);

    const riskToleranceProfile =
        getRiskToleranceProfile(riskToleranceScore);

    const riskLevel = getMostConservativeProfile([
        timeHorizonProfile,
        investmentKnowledgeProfile,
        investmentObjectiveProfile,
        riskCapacityProfile,
        riskToleranceProfile,
    ]);

    return {
        riskLevel,

        timeHorizonProfile,
        investmentKnowledgeProfile,
        investmentObjectiveProfile,

        riskCapacityScore,
        riskCapacityProfile,

        riskToleranceScore,
        riskToleranceProfile,
    };
}