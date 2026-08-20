import { useState } from 'react';

const FinancialProductSearchPage = () => {
    const [searchAssetClass, setSearchAssetClass] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const assetClasses = [
        'Equity',
        'Fixed Income',
        'Cash Equivalent',
    ];

    const handleSearch = async () => {
        if (!searchAssetClass) {
            return;
        }

        try {
            const assetClass =
                encodeURIComponent(searchAssetClass);

            const response = await fetch(
                `http://localhost:4000/api/financialProduct?assetClass=${assetClass}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to fetch financial products'
                );
            }

            const data = await response.json();

            setSearchResults(data.data);
        } catch (error) {
            console.error(
                'Error fetching financial products:',
                error.message
            );
        }
    };

    return (
        <div>
            <h2>
                Search Financial Products by Asset Class
            </h2>

            <div>
                <select
                    value={searchAssetClass}
                    onChange={(e) =>
                        setSearchAssetClass(e.target.value)
                    }
                >
                    <option value="">
                        Select an Asset Class
                    </option>

                    {assetClasses.map((assetClass) => (
                        <option
                            key={assetClass}
                            value={assetClass}
                        >
                            {assetClass}
                        </option>
                    ))}
                </select>

                <button onClick={handleSearch}>
                    Search
                </button>
            </div>

            <h3>Search Results</h3>

            <ul>
                {searchResults.map((product) => (
                    <li
                        key={product.id}
                        style={{
                            marginBottom: '20px',
                        }}
                    >
                        <strong>Name:</strong>{' '}
                        {product.name}
                        <br />

                        <strong>Asset Class:</strong>{' '}
                        {product.assetClass}
                        <br />

                        <strong>Product Type:</strong>{' '}
                        {product.productType}
                        <br />

                        <strong>Institution:</strong>{' '}
                        {product.institution}
                        <br />

                        {product.interestRate != null && (
                            <>
                                <strong>
                                    Interest Rate:
                                </strong>{' '}
                                {product.interestRate}%
                                <br />
                            </>
                        )}

                        <strong>Fee:</strong>{' '}
                        {product.fee}%
                        <br />

                        <strong>Risk Level:</strong>{' '}
                        {product.riskLevel}
                        <br />

                        <strong>Description:</strong>{' '}
                        {product.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinancialProductSearchPage;