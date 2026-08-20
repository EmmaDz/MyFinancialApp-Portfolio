import fs from 'fs/promises';

import sequelize from '../config/db.js';
import FinancialProduct from '../models/financialProductModel.js';


async function seedFinancialProducts() {
    try {
        await sequelize.authenticate();

        console.log(
            'Database connection established successfully.'
        );

        const fileUrl = new URL(
            '../seed/financialProducts.json',
            import.meta.url
        );

        const fileContent =
            await fs.readFile(
                fileUrl,
                'utf-8'
            );

        const products =
            JSON.parse(fileContent);

        if (!Array.isArray(products)) {
            throw new Error(
                'Seed data must be an array.'
            );
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const product of products) {
            const existingProduct =
                await FinancialProduct.findOne({
                    where: {
                        name: product.name,
                        institution:
                            product.institution,
                    },
                });

            if (existingProduct) {
                skippedCount++;

                console.log(
                    `Skipped existing product: ${product.name}`
                );

                continue;
            }

            await FinancialProduct.create(
                product
            );

            createdCount++;

            console.log(
                `Created product: ${product.name}`
            );
        }

        console.log('\nSeed completed.');
        console.log(
            `Created: ${createdCount}`
        );
        console.log(
            `Skipped: ${skippedCount}`
        );
    } catch (error) {
        console.error(
            'Financial product seed failed:',
            error
        );

        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}


seedFinancialProducts();