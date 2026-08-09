import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questionaire.css';

const Questionaire = () => {
    const [formData, setFormData] = useState({
        Q1: '',  Q2: '',  Q3: '',  Q4: '',
        Q5: '',  Q6: '',  Q7: '',  Q8: '',
        Q9: '', Q10: '', Q11: '', Q12: ''});

    const navigate = useNavigate(); 

    useEffect(() => {// sychorize the data user chose when clicking back in the result page
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
        localStorage.setItem('formData', JSON.stringify({ ...formData, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const data = { ...formData };
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found. User might not be logged in.');
            return;
        }
    
        fetch('http://localhost:4000/api/questionnaire/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(rep => {
            console.log('Response:', rep);
            navigate(`/result?totalScore=${rep.totalScore}&riskRating=${rep.riskRating}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="container">
            <h1 className="p3">What kind of investor are you?</h1><br/>
            <p className="text">
                Before you invest, it is important to understand what kind of investor you are, which means knowing your willingness and ability to accept risk, your investment time horizon, and your objectives. Answering these questions will best help us understand your current situation.
            </p><br />
            <p2 className="hint">
                Hint: All the questions are compulsory.
            </p2>
            <p2 className="hint"><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Only the final risk tolerant level and total score will be stored in your profile. You do not have to worry about the data leak of your choices to each of the questions.
            </p2>

            <form id="quizForm" onSubmit={handleSubmit}>
            <br />
                <div className="questionGroup">
                    <p className="p1">Question 1: Which statement best describes your knowledge of investments?</p>
                    <label><input type="radio" name="Q1" value="A" required onChange={handleChange} /> A. I have very little knowledge of investments.(0 points)</label><br />
                    <label><input type="radio" name="Q1" value="B" onChange={handleChange} /> B. I have a moderate level of knowledge.(5 points)</label><br />
                    <label><input type="radio" name="Q1" value="C" onChange={handleChange} /> C. I have extensive knowledge and follow financial markets closely.(10 points)</label><br />
                </div>

                <br />
                <div className="questionGroup">
                    <p className="p1">Question 2: What is your annual income (from all sources)?</p>
                    <label><input type="radio" name="Q2" value="A" required onChange={handleChange} /> A. Less than $25,000 (0 points)</label><br/>
                    <label><input type="radio" name="Q2" value="B" onChange={handleChange} /> B. $25,000 – $49,999 (2 points)</label><br />
                    <label><input type="radio" name="Q2" value="C" onChange={handleChange} /> C. $50,000 – $74,999 (4 points)</label><br />
                    <label><input type="radio" name="Q2" value="D" onChange={handleChange} /> D. $75,000 – $99,999 (5 points)</label><br />
                    <label><input type="radio" name="Q2" value="E" onChange={handleChange} /> E. $100,000 – $199,999 (7 points)</label><br />
                    <label><input type="radio" name="Q2" value="F" onChange={handleChange} /> F. $200,000 or more (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 3: Your current and future income sources are:</p>
                    <label><input type="radio" name="Q3" value="A" required onChange={handleChange} /> A. Stable (8 points)</label><br />
                    <label><input type="radio" name="Q3" value="B" onChange={handleChange} /> B. Somewhat stable (4 points)</label><br />
                    <label><input type="radio" name="Q3" value="C" onChange={handleChange} /> C. Unstable (1 point)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 4: How would you classify your overall financial situation?</p>
                    <label><input type="radio" name="Q4" value="A" required onChange={handleChange} /> A. No savings and significant debt (0 points)</label><br />
                    <label><input type="radio" name="Q4" value="B" onChange={handleChange} /> B. Little savings and a fair amount of debt (2 points)</label><br />
                    <label><input type="radio" name="Q4" value="C" onChange={handleChange} /> C. Some savings and some debt (5 points)</label><br />
                    <label><input type="radio" name="Q4" value="D" onChange={handleChange} /> D. Some savings and little or no debt (7 points)</label><br />
                    <label><input type="radio" name="Q4" value="E" onChange={handleChange} /> E. Significant savings and little or no debt (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 5: What is your estimated net worth?</p>
                    <label><input type="radio" name="Q5" value="A" required onChange={handleChange} /> A. Less than $50,000 (0 points)</label><br />
                    <label><input type="radio" name="Q5" value="B" onChange={handleChange} /> B. $50,000 – $99,999 (2 points)</label><br />
                    <label><input type="radio" name="Q5" value="C" onChange={handleChange} /> C. $100,000 – $249,999 (4 points)</label><br />
                    <label><input type="radio" name="Q5" value="D" onChange={handleChange} /> D. $250,000 – $499,999 (6 points)</label><br />
                    <label><input type="radio" name="Q5" value="E" onChange={handleChange} /> E. $500,000 - $999,999 (8 points)</label><br />
                    <label><input type="radio" name="Q5" value="F" onChange={handleChange} /> F. $1,000,000 or more (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 6: This investment account represents approximately what percentage of your total savings and investments?</p>
                    <label><input type="radio" name="Q6" value="A" required onChange={handleChange} /> A. Less than 25% (10 points)</label><br />
                    <label><input type="radio" name="Q6" value="B" onChange={handleChange} /> B. 25% - 50% (5 points)</label><br />
                    <label><input type="radio" name="Q6" value="C" onChange={handleChange} /> C. 51% - 75% (4 points)</label><br />
                    <label><input type="radio" name="Q6" value="D" onChange={handleChange} /> D. More than 75% (2 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 7: What is your age group?</p>
                    <label><input type="radio" name="Q7" value="A" required onChange={handleChange} /> A. Under 35 (20 points)</label><br />
                    <label><input type="radio" name="Q7" value="B" onChange={handleChange} /> B. 35-54 (8 points)</label><br />
                    <label><input type="radio" name="Q7" value="C" onChange={handleChange} /> C. 55-64 (3 points)</label><br />
                    <label><input type="radio" name="Q7" value="D" onChange={handleChange} /> D. 65 or older (1 point)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 8: In making financial and investment decisions you are:</p>
                    <label><input type="radio" name="Q8" value="A" required onChange={handleChange} /> A. Very conservative and try to minimize risk and avoid the possibility of any loss (0 points)</label><br />
                    <label><input type="radio" name="Q8" value="B" onChange={handleChange} /> B. Conservative but willing to accept a small amount of risk (4 points)</label><br />
                    <label><input type="radio" name="Q8" value="C" onChange={handleChange} /> C. Willing to accept a moderate level of risk and tolerate losses to achieve potentially higher returns (6 points)</label><br />
                    <label><input type="radio" name="Q8" value="D" onChange={handleChange} /> D. Aggressive and typically take on significant risk (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 9: The value of an investment portfolio will generally go up and down over time. Assuming that you have invested $10,000, how much of a decline in your investment portfolio could you tolerate in a 12-month period?</p>
                    <label><input type="radio" name="Q9" value="A" required onChange={handleChange} /> A. I could not tolerate any loss (0 points)</label><br />
                    <label><input type="radio" name="Q9" value="B" onChange={handleChange} /> B. -$300 (-3%) (3 points)</label><br />
                    <label><input type="radio" name="Q9" value="C" onChange={handleChange} /> C. -$1,000 (-10%) (6 points)</label><br />
                    <label><input type="radio" name="Q9" value="D" onChange={handleChange} /> D. -$2,000 (-20%) (8 points)</label><br />
                    <label><input type="radio" name="Q9" value="E" onChange={handleChange} /> E. More than -$2,000 (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 10: When you are faced with a major financial decision, are you more concerned about the possible losses or the possible gains?</p>
                    <label><input type="radio" name="Q10" value="A" required onChange={handleChange} /> A. Always the possible losses (0 points)</label><br />
                    <label><input type="radio" name="Q10" value="B" onChange={handleChange} /> B. Usually the possible losses (3 points)</label><br />
                    <label><input type="radio" name="Q10" value="C" onChange={handleChange} /> C. Usually the possible gains (6 points)</label><br />
                    <label><input type="radio" name="Q10" value="D" onChange={handleChange} /> D. Always the possible gains (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 11: The chart below shows the greatest one-year loss and the highest one-year gain on four different investments of $10,000. Given the potential gain or loss in any one year, which investment would you likely invest your money in?</p>
                    <label><input type="radio" name="Q11" value="A" required onChange={handleChange} /> A. EITHER a loss of $0 OR a gain of $200 (0 points)</label><br />
                    <label><input type="radio" name="Q11" value="B" onChange={handleChange} /> B. EITHER a loss of $200 OR a gain of $500 (3 points)</label><br />
                    <label><input type="radio" name="Q11" value="C" onChange={handleChange} /> C. EITHER a loss of $800 OR a gain of $1,200 (6 points)</label><br />
                    <label><input type="radio" name="Q11" value="D" onChange={handleChange} /> D. EITHER a loss of $2,000 OR a gain of $2,500 (10 points)</label><br />
                </div>
                <br />
                <div className="questionGroup">
                    <p className="p1">Question 12: From September 2008 through November 2008, North American stock markets lost over 30%. If you currently owned an investment that lost over 30% in 3 months, you would:</p>
                    <label><input type="radio" name="Q12" value="A" required onChange={handleChange} /> A. Sell all of the remaining investment to avoid further losses (0 points)</label><br />
                    <label><input type="radio" name="Q12" value="B" onChange={handleChange} /> B. Sell a portion of the remaining investment to protect some of your capital (3 points)</label><br />
                    <label><input type="radio" name="Q12" value="C" onChange={handleChange} /> C. Hold onto the investment and not sell any of the investment in the hopes of higher future returns (5 points)</label><br />
                    <label><input type="radio" name="Q12" value="D" onChange={handleChange} /> D. Buy more of the investment now that prices are lower (10 points)</label><br />
                </div>
                <button type="submit" className="button">Submit</button>
            </form>
            <p id="result"></p>

            <p2>The source of the questions are from Canadian Investment Regulatory Organization. </p2>
            <p2>https://www.ciro.ca/</p2>
        </div>
    );
};

export default Questionaire;