import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questionaire.css';

const STORAGE_KEY = 'riskQuestionnaireV2';

const initialFormData = {
    Q1: '',
    Q2: '',
    Q3: '',
    Q4: '',
    Q5: '',
    Q6: '',
    Q7: '',
    Q8: '',
    Q9: '',
    Q10: '',
    Q11: '',
    Q12: '',
    Q13: '',
    Q14: '',
    Q15: '',
};

const questions = [
    {
        id: 'Q1',
        section: 'Investment Time Horizon',
        text: 'When do you expect to withdraw a significant portion of the money in this portfolio?',
        options: [
            { value: 'A', label: 'Less than 1 year' },
            { value: 'B', label: '1-3 years' },
            { value: 'C', label: '4-6 years' },
            { value: 'D', label: '7-9 years' },
            { value: 'E', label: '10 years or more' },
        ],
    },

    {
        id: 'Q2',
        section: 'Investment Knowledge',
        text: 'Which statement best describes your knowledge of investments?',
        options: [
            {
                value: 'A',
                label: 'I have very little knowledge of investments.',
            },
            {
                value: 'B',
                label: 'I have a moderate level of investment knowledge.',
            },
            {
                value: 'C',
                label: 'I have extensive investment knowledge and follow financial markets closely.',
            },
        ],
    },

    {
        id: 'Q3',
        section: 'Investment Objective',
        text: 'What is your primary goal for this portfolio?',
        options: [
            {
                value: 'A',
                label: 'Preserve my money and minimize the possibility of short-term losses.',
            },
            {
                value: 'B',
                label: 'Generate a relatively steady source of investment income.',
            },
            {
                value: 'C',
                label: 'Balance income generation with some long-term growth.',
            },
            {
                value: 'D',
                label: 'Focus primarily on long-term growth.',
            },
        ],
    },

    {
        id: 'Q4',
        section: 'Risk Capacity',
        text: 'What is your annual income from all sources?',
        options: [
            { value: 'A', label: 'Less than $25,000' },
            { value: 'B', label: '$25,000 - $49,999' },
            { value: 'C', label: '$50,000 - $74,999' },
            { value: 'D', label: '$75,000 - $99,999' },
            { value: 'E', label: '$100,000 - $199,999' },
            { value: 'F', label: '$200,000 or more' },
        ],
    },

    {
        id: 'Q5',
        text: 'How would you describe the stability of your current and future income sources?',
        options: [
            { value: 'A', label: 'Stable' },
            { value: 'B', label: 'Somewhat stable' },
            { value: 'C', label: 'Unstable' },
        ],
    },

    {
        id: 'Q6',
        text: 'How would you classify your overall financial situation?',
        options: [
            {
                value: 'A',
                label: 'No savings and significant debt',
            },
            {
                value: 'B',
                label: 'Little savings and a fair amount of debt',
            },
            {
                value: 'C',
                label: 'Some savings and some debt',
            },
            {
                value: 'D',
                label: 'Some savings and little or no debt',
            },
            {
                value: 'E',
                label: 'Significant savings and little or no debt',
            },
        ],
    },

    {
        id: 'Q7',
        text: 'What is your estimated net worth?',
        options: [
            { value: 'A', label: 'Less than $50,000' },
            { value: 'B', label: '$50,000 - $99,999' },
            { value: 'C', label: '$100,000 - $249,999' },
            { value: 'D', label: '$250,000 - $499,999' },
            { value: 'E', label: '$500,000 - $999,999' },
            { value: 'F', label: '$1,000,000 or more' },
        ],
    },

    {
        id: 'Q8',
        text: 'Approximately what percentage of your total savings and investments does this portfolio represent?',
        options: [
            { value: 'A', label: 'Less than 25%' },
            { value: 'B', label: '25% - 50%' },
            { value: 'C', label: '51% - 75%' },
            { value: 'D', label: 'More than 75%' },
        ],
    },

    {
        id: 'Q9',
        text: 'What is your age group?',
        options: [
            { value: 'A', label: 'Under 35' },
            { value: 'B', label: '35-54' },
            { value: 'C', label: '55-64' },
            { value: 'D', label: '65 or older' },
        ],
    },

    {
        id: 'Q10',
        section: 'Risk Tolerance',
        text: 'When making financial and investment decisions, how would you describe yourself?',
        options: [
            {
                value: 'A',
                label: 'Very conservative and focused on avoiding losses',
            },
            {
                value: 'B',
                label: 'Conservative but willing to accept a small amount of risk',
            },
            {
                value: 'C',
                label: 'Comfortable accepting moderate risk for potentially higher returns',
            },
            {
                value: 'D',
                label: 'Comfortable accepting significant risk for potentially higher returns',
            },
        ],
    },

    {
        id: 'Q11',
        text: 'If you invested $10,000, how much of a decline could you tolerate over a 12-month period?',
        options: [
            { value: 'A', label: 'I could not tolerate any loss' },
            { value: 'B', label: 'About $300 (3%)' },
            { value: 'C', label: 'About $1,000 (10%)' },
            { value: 'D', label: 'About $2,000 (20%)' },
            { value: 'E', label: 'More than $2,000 (more than 20%)' },
        ],
    },

    {
        id: 'Q12',
        text: 'When faced with a major financial decision, are you more concerned about possible losses or possible gains?',
        options: [
            { value: 'A', label: 'Always the possible losses' },
            { value: 'B', label: 'Usually the possible losses' },
            { value: 'C', label: 'Usually the possible gains' },
            { value: 'D', label: 'Always the possible gains' },
        ],
    },

    {
        id: 'Q13',
        text: 'Which hypothetical one-year gain/loss combination would you be most comfortable accepting on a $10,000 investment?',
        options: [
            {
                value: 'A',
                label: 'No loss / potential gain of $200',
            },
            {
                value: 'B',
                label: 'Potential loss of $200 / potential gain of $500',
            },
            {
                value: 'C',
                label: 'Potential loss of $800 / potential gain of $1,200',
            },
            {
                value: 'D',
                label: 'Potential loss of $2,000 / potential gain of $2,500',
            },
        ],
    },

    {
        id: 'Q14',
        text: 'If an investment you owned fell by more than 30% over a short period, what would you most likely do?',
        options: [
            {
                value: 'A',
                label: 'Sell the entire investment to avoid further losses',
            },
            {
                value: 'B',
                label: 'Sell part of the investment to reduce potential losses',
            },
            {
                value: 'C',
                label: 'Hold the investment and wait for a possible recovery',
            },
            {
                value: 'D',
                label: 'Buy more while prices are lower',
            },
        ],
    },

    {
        id: 'Q15',
        text: 'Which pattern of yearly investment returns would you be most comfortable holding over the long term?',
        options: [
            {
                value: 'A',
                label: 'Small, relatively stable gains with very little risk of loss',
            },
            {
                value: 'B',
                label: 'Moderate gains with occasional moderate losses',
            },
            {
                value: 'C',
                label: 'Larger potential gains with larger fluctuations and losses',
            },
            {
                value: 'D',
                label: 'High potential gains with very large fluctuations and possible losses',
            },
        ],
    },
];


const Questionaire = () => {
    const [formData, setFormData] = useState(initialFormData);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const savedData = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (savedData) {
                setFormData({
                    ...initialFormData,
                    ...savedData,
                });
            }
        } catch (error) {
            console.error(
                'Unable to restore questionnaire answers:',
                error
            );

            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);


    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(previousData => {
            const updatedData = {
                ...previousData,
                [name]: value,
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedData)
            );

            return updatedData;
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            console.error(
                'No token found. User might not be logged in.'
            );
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:4000/api/questionnaire/submit-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            console.log('Response:', result);

            navigate('/result', {
                state: {
                    assessment: result.assessment,
                },
            });
        } catch (error) {
            console.error(
                'Error submitting questionnaire:',
                error
            );
        }
    };


    return (
        <div className="container">
            <h1 className="p3">
                What kind of investor are you?
            </h1>

            <p className="text">
                This questionnaire explores your investment time
                horizon, knowledge, objectives, financial ability to
                withstand losses, and willingness to accept risk.
            </p>

            <p className="hint">
                All questions are required.
            </p>

            <p className="hint">
                This tool is provided for educational and
                demonstration purposes only and does not constitute
                financial or investment advice.
            </p>

            <form id="quizForm" onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={question.id}>
                        {question.section && (
                            <h2>{question.section}</h2>
                        )}

                        <div className="questionGroup">
                            <p className="p1">
                                Question {index + 1}:{' '}
                                {question.text}
                            </p>

                            {question.options.map(option => (
                                <label
                                    key={`${question.id}-${option.value}`}
                                >
                                    <input
                                        type="radio"
                                        name={question.id}
                                        value={option.value}
                                        checked={
                                            formData[question.id] ===
                                            option.value
                                        }
                                        required
                                        onChange={handleChange}
                                    />

                                    {' '}
                                    {option.value}. {option.label}
                                    <br />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="button"
                >
                    Submit
                </button>
            </form>

            <p className="hint">
                Risk-profile methodology is based on concepts
                presented in CIRO investor education materials.
            </p>
        </div>
    );
};

export default Questionaire;