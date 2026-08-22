const RISK_RANK = {
    'Very Conservative': 1,
    Conservative: 2,
    Balanced: 3,
    Growth: 4,
    'Aggressive Growth': 5,
};


export function isRiskCompatible(
    userRiskLevel,
    productRiskLevel
) {
    const userRank =
        RISK_RANK[userRiskLevel];

    const productRank =
        RISK_RANK[productRiskLevel];

    if (!userRank) {
        throw new Error(
            `Invalid user risk level: ${userRiskLevel}`
        );
    }

    if (!productRank) {
        throw new Error(
            `Invalid product risk level: ${productRiskLevel}`
        );
    }

    return productRank <= userRank;
}


export function filterCompatibleProducts(
    userRiskLevel,
    products
) {
    if (!Array.isArray(products)) {
        throw new Error(
            'Products must be an array.'
        );
    }

    return products.filter(
        product =>
            isRiskCompatible(
                userRiskLevel,
                product.riskLevel
            )
    );
}