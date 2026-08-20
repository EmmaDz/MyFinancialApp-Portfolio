import Sequelize from 'sequelize';


export async function up(queryInterface) {
    await queryInterface.removeColumn(
        'recommendations',
        'name'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'type'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'institution'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'interestRate'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'description'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'riskLevel'
    );

    await queryInterface.removeColumn(
        'recommendations',
        'fee'
    );

    await queryInterface.changeColumn(
        'recommendations',
        'investmentProportion',
        {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
        }
    );
}


export async function down(queryInterface) {
    await queryInterface.addColumn(
        'recommendations',
        'name',
        {
            type: Sequelize.STRING,
            allowNull: false,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'type',
        {
            type: Sequelize.STRING,
            allowNull: false,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'institution',
        {
            type: Sequelize.STRING,
            allowNull: false,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'interestRate',
        {
            type: Sequelize.STRING,
            allowNull: true,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'description',
        {
            type: Sequelize.STRING,
            allowNull: true,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'riskLevel',
        {
            type: Sequelize.STRING,
            allowNull: false,
        }
    );

    await queryInterface.addColumn(
        'recommendations',
        'fee',
        {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0',
        }
    );

    await queryInterface.changeColumn(
        'recommendations',
        'investmentProportion',
        {
            type: Sequelize.FLOAT,
            allowNull: false,
        }
    );
}