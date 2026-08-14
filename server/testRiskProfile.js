import { calculateRiskProfile } from './services/riskProfileService.js';

const answers = {
    Q1: 'E',
    Q2: 'B',
    Q3: 'D',

    Q4: 'A',
    Q5: 'C',
    Q6: 'A',
    Q7: 'A',
    Q8: 'D',
    Q9: 'D',

    Q10: 'D',
    Q11: 'E',
    Q12: 'D',
    Q13: 'B',
    Q14: 'D',
    Q15: 'C',
};

try {
    const result = calculateRiskProfile(answers);

    console.log('Risk Profile Result:');
    console.log(result);
} catch (error) {
    console.error('Error:', error.message);
}