import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const UserSelection = () => {
    const [
        searchAssetClass,
        setSearchAssetClass
    ] = useState('');

    const [
        searchResults,
        setSearchResults
    ] = useState([]);

    const [
        selectedProducts,
        setSelectedProducts
    ] = useState([]);

    const navigate = useNavigate();


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
                encodeURIComponent(
                    searchAssetClass
                );

            const response =
                await fetch(
                    `http://localhost:4000/api/financialProduct?assetClass=${assetClass}`
                );

            if (!response.ok) {
                throw new Error(
                    'Failed to fetch financial products'
                );
            }

            const data =
                await response.json();

            setSearchResults(
                data.data.map(product => ({
                    ...product,
                    isChecked:
                        selectedProducts.some(
                            selected =>
                                selected.id ===
                                product.id
                        ),
                }))
            );
        } catch (error) {
            console.error(
                'Error fetching financial products:',
                error.message
            );
        }
    };


    const handleCheckboxChange =
        (product) => {
            const isAlreadySelected =
                selectedProducts.some(
                    selected =>
                        selected.id ===
                        product.id
                );

            if (isAlreadySelected) {
                setSelectedProducts(
                    selectedProducts.filter(
                        selected =>
                            selected.id !==
                            product.id
                    )
                );
            } else {
                setSelectedProducts([
                    ...selectedProducts,
                    product,
                ]);
            }
        };


    const allAssetClassesSelected = () => {
        const selectedAssetClasses =
            new Set(
                selectedProducts.map(
                    product =>
                        product.assetClass
                )
            );

        return assetClasses.every(
            assetClass =>
                selectedAssetClasses.has(
                    assetClass
                )
        );
    };


    return (
        <div>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#fff',
                    padding: '10px',
                    zIndex: 1000,
                }}
            >
                <h2>
                    Search Financial Products
                    by Asset Class
                </h2>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                    }}
                >
                    <select
                        value={
                            searchAssetClass
                        }
                        onChange={e =>
                            setSearchAssetClass(
                                e.target.value
                            )
                        }
                        style={{
                            flexGrow: 1,
                        }}
                    >
                        <option value="">
                            Select an Asset Class
                        </option>

                        {assetClasses.map(
                            assetClass => (
                                <option
                                    key={
                                        assetClass
                                    }
                                    value={
                                        assetClass
                                    }
                                >
                                    {
                                        assetClass
                                    }
                                </option>
                            )
                        )}
                    </select>

                    <button
                        onClick={
                            handleSearch
                        }
                    >
                        Search
                    </button>
                </div>
            </div>


            <div
                style={{
                    overflowY: 'auto',
                    maxHeight: '400px',
                    marginTop: '20px',
                }}
            >
                <ul>
                    {searchResults.map(
                        product => (
                            <li
                                key={
                                    product.id
                                }
                                style={{
                                    listStyleType:
                                        'none',
                                    marginBottom:
                                        '16px',
                                }}
                            >
                                <strong>
                                    Name:
                                </strong>{' '}
                                {product.name}
                                <br />

                                <strong>
                                    Asset Class:
                                </strong>{' '}
                                {
                                    product.assetClass
                                }
                                <br />

                                <strong>
                                    Product Type:
                                </strong>{' '}
                                {
                                    product.productType
                                }
                                <br />

                                <strong>
                                    Institution:
                                </strong>{' '}
                                {
                                    product.institution
                                }
                                <br />

                                {product.interestRate !=
                                    null && (
                                    <>
                                        <strong>
                                            Interest
                                            Rate:
                                        </strong>{' '}
                                        {
                                            product.interestRate
                                        }
                                        %
                                        <br />
                                    </>
                                )}

                                <strong>
                                    Fee:
                                </strong>{' '}
                                {product.fee}%
                                <br />

                                <strong>
                                    Risk Level:
                                </strong>{' '}
                                {
                                    product.riskLevel
                                }
                                <br />

                                <strong>
                                    Description:
                                </strong>{' '}
                                {
                                    product.description
                                }
                                <br />

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.some(
                                            selected =>
                                                selected.id ===
                                                product.id
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                product
                                            )
                                        }
                                    />{' '}
                                    Select
                                </label>
                            </li>
                        )
                    )}
                </ul>
            </div>


            {!allAssetClassesSelected() && (
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor:
                            '#fff',
                        padding: '10px',
                        textAlign:
                            'center',
                    }}
                >
                    <p>
                        Select at least one
                        product from each
                        asset class to continue.
                    </p>
                </div>
            )}


            {allAssetClassesSelected() && (
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor:
                            '#fff',
                        padding: '10px',
                        textAlign:
                            'center',
                    }}
                >
                    <button
                        onClick={() =>
                            navigate(
                                '/recommendations',
                                {
                                    state: {
                                        selectedProducts,
                                    },
                                }
                            )
                        }
                    >
                        Generate
                        Recommendations
                    </button>
                </div>
            )}
        </div>
    );
};


export default UserSelection;