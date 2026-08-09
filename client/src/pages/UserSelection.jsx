import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinancialProductSearchPage = () => {
    const [searchType, setSearchType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();

    const productTypes = ["Stock", "Fund", "Cash&Equivalent"]; // Defined list of product types

    const handleSearch = async () => {
        try {
            const type = encodeURIComponent(searchType);
            const response = await fetch(`http://localhost:4000/api/financialProduct/queryByType?type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data.map(product => ({
                    ...product,
                    isChecked: selectedProducts.some(p => p.id === product.id)
                })));
            } else {
                throw new Error('Failed to fetch financial products');
            }
        } catch (error) {
            console.error('Error fetching financial products:', error.message);
        }
    };

    const handleCheckboxChange = (product) => {
        const isAlreadySelected = selectedProducts.some(p => p.id === product.id);
        if (isAlreadySelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const allTypesSelected = () => {
        const selectedTypes = new Set(selectedProducts.map(p => p.type));
        return productTypes.every(type => selectedTypes.has(type));
    };

    return (
        <div>
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', padding: '10px', zIndex: 1000 }}>
                <h2>Search Financial Products by Type</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={searchType} onChange={e => setSearchType(e.target.value)} style={{ flexGrow: 1 }}>
                        <option value="">Select a Product Type</option>
                        {productTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '400px', marginTop: '20px' }}>
                <ul>
                    {searchResults.map((product) => (
                        <li key={product.id} style={{ listStyleType: 'none', marginBottom: '10px' }}>
                            <strong>Name:</strong> {product.name} <br />
                            <strong>Type:</strong> {product.type} <br />
                            <strong>Institution:</strong> {product.institution} <br />
                            <strong>Interest Rate:</strong> {product.interestRate} <br />
                            <strong>Description:</strong> {product.description} <br />
                            <strong>Risk Level:</strong> {product.riskLevel} <br />
                            <input
                                type="checkbox"
                                checked={selectedProducts.some(p => p.id === product.id)}
                                onChange={() => handleCheckboxChange(product)}
                            /> Select
                        </li>
                    ))}
                </ul>
            </div>
            {!allTypesSelected() && (
                <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '10px', textAlign: 'center', color: 'red' }}>
                    <p>Please make sure to select at least one product from each type to generate recommendations.</p>
                </div>
            )}
            {allTypesSelected() && (
                <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => navigate('/recommendations', { state: { selectedProducts } })}>
                        Generate Recommendations
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinancialProductSearchPage;
