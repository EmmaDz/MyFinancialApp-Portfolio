import Sequelize from 'sequelize';


export async function up(queryInterface) {
    await queryInterface.renameColumn(
        'financialProducts',
        'type',
        'assetClass'
    );

    await queryInterface.addColumn(
        'financialProducts',
        'productType',
        {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Other',
        }
    );

    await queryInterface.changeColumn(
        'financialProducts',
        'interestRate',
        {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
        }
    );

    await queryInterface.changeColumn(
        'financialProducts',
        'description',
        {
            type: Sequelize.TEXT,
            allowNull: true,
        }
    );

    await queryInterface.changeColumn(
        'financialProducts',
        'fee',
        {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0,
        }
    );
}


export async function down(queryInterface) {
    await queryInterface.changeColumn(
        'financialProducts',
        'fee',
        {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0',
        }
    );

    await queryInterface.changeColumn(
        'financialProducts',
        'description',
        {
            type: Sequelize.STRING,
            allowNull: true,
        }
    );

    await queryInterface.changeColumn(
        'financialProducts',
        'interestRate',
        {
            type: Sequelize.STRING,
            allowNull: true,
        }
    );

    await queryInterface.removeColumn(
        'financialProducts',
        'productType'
    );

    await queryInterface.renameColumn(
        'financialProducts',
        'assetClass',
        'type'
    );
}