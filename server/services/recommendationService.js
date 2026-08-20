const SUPPORTED_ASSET_CLASSES = [
    'Equity',
    'Fixed Income',
    'Cash Equivalent',
];


const PORTFOLIO_FIELD_BY_ASSET_CLASS = {
    Equity: 'equity',
    'Fixed Income': 'fixedIncome',
    'Cash Equivalent': 'cashEquivalent',
};


function splitAllocation(totalAllocation, count) {
    if (count <= 0) {
        throw new Error(
            'Product count must be greater than zero.'
        );
    }

    const totalUnits =
        Math.round(totalAllocation * 100);

    const baseUnits =
        Math.floor(totalUnits / count);

    const remainder =
        totalUnits % count;

    return Array.from(
        { length: count },
        (_, index) => {
            const units =
                baseUnits +
                (index < remainder ? 1 : 0);

            return units / 100;
        }
    );
}


export function generateProductAllocations(
    portfolio,
    products
) {
    if (!portfolio) {
        throw new Error(
            'Portfolio is required.'
        );
    }

    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {
        throw new Error(
            'At least one financial product is required.'
        );
    }


    const groupedProducts = {
        Equity: [],
        'Fixed Income': [],
        'Cash Equivalent': [],
    };


    for (const product of products) {
        if (
            !SUPPORTED_ASSET_CLASSES.includes(
                product.assetClass
            )
        ) {
            throw new Error(
                `Unsupported asset class: ${product.assetClass}`
            );
        }

        groupedProducts[
            product.assetClass
        ].push(product);
    }


    const recommendations = [];


    for (
        const assetClass of
        SUPPORTED_ASSET_CLASSES
    ) {
        const productsInClass =
            groupedProducts[assetClass];

        const portfolioField =
            PORTFOLIO_FIELD_BY_ASSET_CLASS[
                assetClass
            ];

        const classAllocation =
            Number(
                portfolio[portfolioField]
            );


        if (classAllocation > 0 &&
            productsInClass.length === 0) {
            throw new Error(
                `At least one product must be selected for ${assetClass}.`
            );
        }


        if (productsInClass.length === 0) {
            continue;
        }


        const allocations =
            splitAllocation(
                classAllocation,
                productsInClass.length
            );


        productsInClass.forEach(
            (product, index) => {
                recommendations.push({
                    productId:
                        product.id,

                    assetClass:
                        product.assetClass,

                    investmentProportion:
                        allocations[index],
                });
            }
        );
    }


    return recommendations;
}