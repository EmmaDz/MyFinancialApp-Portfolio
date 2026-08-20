import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const RecommendationsPage = () => {
    const location = useLocation();

    const selectedProducts =
        location.state?.selectedProducts;

    const [
        recommendations,
        setRecommendations
    ] = useState([]);

    const [
        error,
        setError
    ] = useState('');


    useEffect(() => {
        if (!selectedProducts?.length) {
            return;
        }

        const token =
            localStorage.getItem('token');


        const generateRecommendations =
            async () => {
                try {
                    setError('');

                    const productIds =
                        selectedProducts.map(
                            product =>
                                product.id
                        );


                    const response =
                        await axios.post(
                            'http://localhost:4000/api/recommendations/generate',
                            {
                                productIds,
                            },
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                    'Content-Type':
                                        'application/json',
                                },
                            }
                        );


                    setRecommendations(
                        response.data.data
                    );
                } catch (error) {
                    console.error(
                        'Failed to generate recommendations:',
                        error
                    );

                    setError(
                        error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Failed to generate recommendations.'
                    );
                }
            };


        generateRecommendations();
    }, [selectedProducts]);


    if (!selectedProducts?.length) {
        return (
            <div>
                <h2>
                    Recommended Financial Products
                </h2>

                <p>
                    No selected products were
                    provided. Please return to
                    the product selection page.
                </p>
            </div>
        );
    }


    return (
        <div>
            <h2>
                Recommended Financial Products
            </h2>


            {error && (
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            )}


            {!error &&
                recommendations.length === 0 && (
                    <p>
                        Generating recommendations...
                    </p>
                )}


            {recommendations.length > 0 && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Name
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Asset Class
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Product Type
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Institution
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Interest Rate
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Risk Level
                                </th>

                                <th
                                    style={{
                                        paddingRight:
                                            '20px',
                                    }}
                                >
                                    Fee
                                </th>

                                <th
                                    style={{
                                        paddingLeft:
                                            '20px',
                                    }}
                                >
                                    Investment Proportion
                                </th>
                            </tr>
                        </thead>


                        <tbody>
                            {recommendations.map(
                                recommendation => {
                                    const product =
                                        recommendation.product;

                                    return (
                                        <tr
                                            key={
                                                recommendation.id
                                            }
                                        >
                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.assetClass
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.productType
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.institution
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.interestRate !=
                                                    null
                                                        ? `${product.interestRate}%`
                                                        : 'N/A'
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.riskLevel
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    paddingRight:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    product.fee
                                                }
                                                %
                                            </td>

                                            <td
                                                style={{
                                                    paddingLeft:
                                                        '20px',
                                                }}
                                            >
                                                {
                                                    recommendation
                                                        .investmentProportion
                                                }
                                                %
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>


                    <div
                        style={{
                            marginTop: '20px',
                            fontSize: '16px',
                            color: 'gray',
                        }}
                    >
                        <strong>
                            Note:
                        </strong>{' '}
                        Each displayed percentage
                        represents the allocation
                        assigned to that specific
                        selected product. Products
                        within the same asset class
                        share that asset class&apos;s
                        target allocation. The
                        allocations shown are part
                        of this educational demo and
                        are not personalized
                        investment advice.
                    </div>
                </>
            )}
        </div>
    );
};


export default RecommendationsPage;