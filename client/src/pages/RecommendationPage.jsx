import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const RecommendationsPage = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts;
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (!selectedProducts?.length) {
            return;
        }

        const token = localStorage.getItem('token');
        const generateRecommendations = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/recommendations/generate', { selectedProducts },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setRecommendations(response.data.data);
            } catch (error) {
                console.error('Failed to generate recommendations:', error);
            }
        };

        generateRecommendations();
    }, [selectedProducts]);

    return (
        <div>
            <h2>Recommended Financial Products</h2>
            <table>
                <thead>
                    <tr>
                        <th style={{ paddingRight: '20px' }}>Name</th>
                        <th style={{ paddingRight: '20px' }}>Type</th>
                        <th style={{ paddingRight: '20px' }}>Institution</th>
                        <th style={{ paddingRight: '20px' }}>Interest Rate</th>
                        <th style={{ paddingRight: '20px' }}>Description</th>
                        <th style={{ paddingRight: '20px' }}>Risk Level</th>
                        <th style={{ paddingRight: '20px' }}>Fee</th>
                        <th style={{ paddingLeft: '20px' }}>Investment Proportion</th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.map(rec => (
                        <tr key={rec.productId}>
                            <td style={{ paddingRight: '20px' }}>{rec.name}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.type}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.institution}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.interestRate}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.description}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.riskLevel}</td>
                            <td style={{ paddingRight: '20px' }}>{rec.fee}</td>
                            <td style={{ paddingLeft: '20px' }}>{`${rec.investmentProportion}%`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "20px", fontSize: "16px", color: "gray" }}>
                <strong>Note:</strong> The investment proportion displayed for each type represents the total investment amount for that category. If you select multiple products of the same type, this number reflects the combined total. You can decide how to allocate your investment within these products based on the given range.
            </div>
        </div>
    );
};

export default RecommendationsPage;
