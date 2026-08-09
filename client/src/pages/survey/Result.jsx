import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css'; 

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [totalScore, setTotalScore] = useState(null);
    const [riskRating, setRiskRating] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const score = params.get('totalScore');
        const rating = params.get('riskRating');
        setTotalScore(score);
        setRiskRating(rating);
    }, [location.search]);
    
    const handleGoToPortfolio = () => {
        navigate(`/portfolio?riskRating=${riskRating}`);
    };

    const getRiskExplanation = () => {
        switch (riskRating) {
            case 'Very Conservative':
                return 'You have a very low tolerance for risk and are unable to tolerate any investment losses. You prefer knowing that your capital is safe and are willing to accept lower returns to protect your capital. You may have also got this result if you have a very short investment time horizon or an investment objective of safety.';
            case 'Conservative':
                return 'You have a low tolerance for risk and potential loss of capital. You are willing to accept some short-term fluctuations and small losses in your investment portfolio in exchange for modest returns. You may have also got this result if you have a shorter investment time horizon or an investment objective of income.';
            case 'Balanced':
                return 'You have a moderate tolerance for risk and loss of capital. You are willing to tolerate some fluctuations in your investment returns and moderate losses of capital. You have at least a medium-term investment time horizon.';
            case 'Growth':
                return 'You have a high tolerance for risk and loss of capital. You are willing to tolerate large fluctuations in your investment returns and moderate to large losses of capital in exchange for potential long-term capital appreciation. You do not have any significant income requirements from your investments. You have at least a medium-term investment time horizon.';
            case 'Aggressive Growth':
                return 'Your tolerance for risk, portfolio volatility, and investment losses is very high. You are willing to tolerate potentially significant and sustained price fluctuations and large losses of capital. You have extensive investment knowledge. You have no income requirements from your investments and have a long investment time horizon.';
            default:
                return 'No explanation available for this risk rating.';
        }
    };

    return (
        <div className="result-container">
            <h1>Your Investment Risk Profile</h1>
            {totalScore && riskRating ? (
                <div className="result">
                    <p><strong>Total Score:</strong> {totalScore}</p>
                    <p><strong>Risk Rating:</strong> {riskRating}</p>
                    <p><strong>Explanation:</strong> {getRiskExplanation()}</p>
                    <p><strong>Hint:</strong>The total score range is 4 to 128</p>
                </div>
            ) : (
                <p>Loading your result...</p>
            )}
            
            <div className="button-container">
               
                <button onClick={() => window.history.back()}>
                    Back
                </button>
                <button onClick={handleGoToPortfolio}>Next</button>
            </div>
        </div>
    );
};

export default Result;