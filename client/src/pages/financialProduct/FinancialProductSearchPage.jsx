import { useState } from 'react';

const FinancialProductSearchPage = () => {
    const [searchType, setSearchType] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/financialProduct/queryByType?type=${searchType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data);
            } else {
                throw new Error('Failed to fetch financial products');
            }
        } catch (error) {
            console.error('Error fetching financial products:', error.message);
        }
    };

    return (
        <div>
            <h2>Search Financial Products by Type</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter product type" 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <h3>Search Results</h3>
            <ul>
                {searchResults.map((product) => (
                    <li key={product.id}>
                        <strong>Name:</strong> {product.name} <br />
                        <strong>Type:</strong> {product.type} <br />
                        <strong>Institution:</strong> {product.institution} <br />
                        <strong>Interest Rate:</strong> {product.interestRate} <br />
                        <strong>Description:</strong> {product.description} <br />
                        <strong>Risk Level:</strong> {product.riskLevel}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinancialProductSearchPage;


