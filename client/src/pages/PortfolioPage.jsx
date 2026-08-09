import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js/auto";
import PropTypes from 'prop-types';

// Register Chart.js plugins
ChartJS.register(Tooltip, Legend, ArcElement);

// Pie chart component
export const PieChartComponent = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                label: function (tooltipItem) {
                    const dataArr = tooltipItem.dataset.data;

                    const sum = dataArr.reduce(
                        (total, value) => total + Number(value),
                        0
                    );

                    const percentage =
                        ((tooltipItem.raw * 100) / sum).toFixed(2) + "%";

                    return `${tooltipItem.label}: ${percentage}`;
                }
            }
        },
    };

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                hoverOffset: 4,
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    return <div style={{ height: '500px', width: '500px' }}>
        <Pie options={options} data={chartData} />
    </div>;
};

PieChartComponent.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

// Portfolio page component
const PortfolioPage = () => {
    const [data, setData] = useState([]);
    const [riskLevel, setRiskLevel] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const riskRating = queryParams.get('riskRating');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (riskRating && token) {
        axios.post('http://localhost:4000/api/portfolio', {riskLevel: riskRating},{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('API response:', response.data);
            const { Stock, Fund, riskLevel } = response.data.portfolio;
            const CashAndEquivalent = response.data.portfolio["Cash&Equivalent"];
            setData([
                { name: 'Stock', value: Stock },
                { name: 'Fund', value: Fund },
                { name: 'Cash&Equivalent', value: CashAndEquivalent }
            ]);
            setRiskLevel(riskLevel);
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error.response ? error.response.data.error : error.message);
        });
    }
    }, [riskRating]);
    

    const handleNavigateToSelection = () => {
        navigate('/userSelection');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', color: '#333', marginBottom: '20px' }}>
                Your Investment Portfolio
            </h1>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                Risk Level: {riskLevel || 'Not available'}
            </p>

            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', maxWidth: '600px', margin: 'auto', marginBottom: '20px' }}>
                Your portfolio allocations are based on established investment strategies to suit your risk profile.
                Learn more about asset allocation strategies and how they might affect your investment choices on these resources:
                <ul>
                    <li><a href="https://www.investopedia.com/terms/a/assetallocation.asp" target="_blank" rel="noopener noreferrer">Investopedia - Asset Allocation</a></li>
                    <li><a href="https://www.investopedia.com/managing-wealth/achieve-optimal-asset-allocation/" target="_blank" rel="noopener noreferrer">Investopedia - Achieve Optimal Asset Allocation</a></li>
                    <li><a href="https://www.merrilledge.com/article/asset-allocation-strategies-to-help-you-manage-risk-and-reach-your-goals" target="_blank" rel="noopener noreferrer">Merrill Edge - Asset Allocation Strategies</a></li>
                    <li><a href="https://smartasset.com/investing/asset-allocation" target="_blank" rel="noopener noreferrer">SmartAsset - Comprehensive Guide to Asset Allocation</a></li>
                </ul>
            </p>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <PieChartComponent data={data} />
            </div>

            <button onClick={handleNavigateToSelection} style={{
                width: '200px',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>
                Select Financial Products
            </button>
        </div>
    );
};

export default PortfolioPage;
