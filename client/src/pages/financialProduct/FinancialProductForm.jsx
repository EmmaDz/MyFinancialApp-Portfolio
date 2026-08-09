import { useState } from 'react';

const FinancialProductForm = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [institution, setInstitution] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [description, setDescription] = useState('');
    const [riskLevel, setRiskLevel] = useState('');
    const [fee,       setFee] = useState('');
    document.title = 'Product Input';

    const handleSubmit = async (e) => {
        e.preventDefault();
    
    
        const newProduct = {
            name,
            type,
            institution,
            interestRate,
            description,
            riskLevel,
            fee,
        };
    
    
        try {
            const res = await fetch('http://localhost:4000/api/financialProduct/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
            }
    
            const responseData = await res.json();
            alert('Financial product created successfully!');
            console.log('Response:', responseData);
    
            setName('');
            setType('');
            setInstitution('');
            setInterestRate('');
            setDescription('');
            setRiskLevel('');
            setFee('');
    
        } catch (error) {
            console.error('Error creating financial product:', error.message);
        }
    };

    return (
        <div> 
            <h2>Create Financial Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <input 
                        type="text" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Institution:</label>
                    <input 
                        type="text" 
                        value={institution} 
                        onChange={(e) => setInstitution(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Interest Rate:</label>
                    <input 
                        type="text" 
                        value={interestRate} 
                        onChange={(e) => setInterestRate(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Risk Level:</label>
                    <input 
                        type="text" 
                        value={riskLevel} 
                        onChange={(e) => setRiskLevel(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Fee:</label>
                    <input 
                        type="text" 
                        value={fee} 
                        onChange={(e) => setFee(e.target.value)} 
                        required 
                    />
                </div>
                
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default FinancialProductForm;