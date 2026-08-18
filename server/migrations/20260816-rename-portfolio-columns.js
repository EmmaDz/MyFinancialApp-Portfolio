export async function up(queryInterface) {
    await queryInterface.renameColumn(
        'portfolios',
        'Stock',
        'equity'
    );

    await queryInterface.renameColumn(
        'portfolios',
        'Fund',
        'fixedIncome'
    );

    await queryInterface.renameColumn(
        'portfolios',
        'Cash&Equivalent',
        'cashEquivalent'
    );
}


export async function down(queryInterface) {
    await queryInterface.renameColumn(
        'portfolios',
        'equity',
        'Stock'
    );

    await queryInterface.renameColumn(
        'portfolios',
        'fixedIncome',
        'Fund'
    );

    await queryInterface.renameColumn(
        'portfolios',
        'cashEquivalent',
        'Cash&Equivalent'
    );
}