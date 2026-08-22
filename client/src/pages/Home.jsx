import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Home = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        document.body.classList.add('special-background');

        return () => {
            document.body.classList.remove('special-background');
        };
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            } else {
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserId(null);
        navigate('/login');
    };

    const buttonStyle = {
        width: '45%',
        display: 'inline-block',
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        textAlign: 'center',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    const goToResultsPage = async () => {
        const riskData = await fetchRiskLevel();
        if (riskData) {
            navigate(`/result?totalScore=${riskData.totalScore}&riskRating=${riskData.riskLevel}`);
        } else {
            alert("No risk data available. Please complete the assessment.");
        }
    };

    const fetchRiskLevel = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token available");
            return;
        }

        try {
            const response = await axios.get('http://localhost:4000/api/questionnaire/risk-level', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching risk info:", error);
        }
    };

    const goToPortfolio = async () => {
        const riskRating = await fetchRiskLevel();
        if (riskRating) {
            navigate(`/portfolio?riskRating=${riskRating.riskLevel}`);
        } else {
            alert("Risk rating is not available. Please complete the necessary steps.");
        }
    };

    const styles = {
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px',
            position: 'relative',
            left: '-60%'
        },
        adminButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px',
            position: 'relative',
            left: '-5%',
            width: '50%'
        }
    };


    //if admin
    if (userId === 3) {
        return (
            <div style={styles.adminButtonContainer}>
                <h1>Welcome, Admin!</h1>
                <p>You are logged in as an admin.</p>
                <button onClick={() => navigate("/financialProductSearch")} style={buttonStyle}>Search Financial
                    Products
                </button>
                <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </div>
        );
    }

    return (
        <div style={styles.buttonContainer}>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            <Link to="/questionaire" style={{...buttonStyle, display: 'inline-block', textDecoration: 'none'}}>Start Survey</Link>
            <button onClick={goToResultsPage} style={buttonStyle}>View Result</button>
            <button onClick={goToPortfolio} style={buttonStyle}>Go to Portfolio</button>
        </div>
    );

};



export default Home;
