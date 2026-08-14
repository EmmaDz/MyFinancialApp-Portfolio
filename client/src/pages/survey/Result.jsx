import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const assessment = location.state?.assessment;


    const handleGoToPortfolio = () => {
        if (!assessment?.riskLevel) {
            return;
        }

        navigate(
            `/portfolio?riskRating=${encodeURIComponent(
                assessment.riskLevel
            )}`
        );
    };


    const getRiskExplanation = (riskLevel) => {
        switch (riskLevel) {
            case 'Very Conservative':
                return (
                    'Your overall profile is Very Conservative. ' +
                    'At least one part of your assessment indicates ' +
                    'that taking substantial investment risk may not ' +
                    'be appropriate for the circumstances represented ' +
                    'in this questionnaire.'
                );

            case 'Conservative':
                return (
                    'Your overall profile is Conservative. ' +
                    'Your assessment suggests that preserving capital ' +
                    'and limiting potential losses are important constraints.'
                );

            case 'Balanced':
                return (
                    'Your overall profile is Balanced. ' +
                    'Your assessment suggests a moderate ability and ' +
                    'willingness to accept investment risk while still ' +
                    'placing importance on stability.'
                );

            case 'Growth':
                return (
                    'Your overall profile is Growth. ' +
                    'Your assessment indicates a relatively strong ' +
                    'ability and willingness to accept fluctuations ' +
                    'in pursuit of longer-term growth.'
                );

            case 'Aggressive Growth':
                return (
                    'Your overall profile is Aggressive Growth. ' +
                    'All evaluated dimensions support a relatively high ' +
                    'capacity and willingness to accept investment risk.'
                );

            default:
                return 'No explanation is available for this risk profile.';
        }
    };


    if (!assessment) {
        return (
            <div className="result-container">
                <h1>Your Investment Risk Profile</h1>

                <p>
                    No assessment result is available.
                    Please complete the questionnaire first.
                </p>

                <div className="button-container">
                    <button
                        onClick={() => navigate('/questionnaire')}
                    >
                        Go to Questionnaire
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="result-container">
            <h1>Your Investment Risk Profile</h1>

            <div className="result">
                <h2>{assessment.riskLevel}</h2>

                <p>
                    <strong>Explanation:</strong>{' '}
                    {getRiskExplanation(
                        assessment.riskLevel
                    )}
                </p>

                <h3>Assessment Details</h3>

                <p>
                    <strong>Investment Time Horizon:</strong>{' '}
                    {assessment.timeHorizonProfile}
                </p>

                <p>
                    <strong>Investment Knowledge:</strong>{' '}
                    {assessment.investmentKnowledgeProfile}
                </p>

                <p>
                    <strong>Investment Objective:</strong>{' '}
                    {assessment.investmentObjectiveProfile}
                </p>

                <p>
                    <strong>Risk Capacity:</strong>{' '}
                    {assessment.riskCapacityProfile}
                    {' '}
                    (Score: {assessment.riskCapacityScore})
                </p>

                <p>
                    <strong>Risk Tolerance:</strong>{' '}
                    {assessment.riskToleranceProfile}
                    {' '}
                    (Score: {assessment.riskToleranceScore})
                </p>

                <p className="hint">
                    Your overall risk profile reflects the most
                    restrictive dimension identified by this
                    educational assessment.
                </p>

                <p className="hint">
                    This tool is provided for educational and
                    demonstration purposes only and does not
                    constitute financial or investment advice.
                </p>
            </div>

            <div className="button-container">
                <button
                    onClick={() => window.history.back()}
                >
                    Back
                </button>

                <button
                    onClick={handleGoToPortfolio}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Result;