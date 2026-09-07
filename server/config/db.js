import Sequelize from 'sequelize';
import 'dotenv/config';


const isTestEnvironment =
    process.env.NODE_ENV === 'test';


const databaseUrl =
    isTestEnvironment
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;


if (!databaseUrl) {
    const variableName =
        isTestEnvironment
            ? 'TEST_DATABASE_URL'
            : 'DATABASE_URL';

    throw new Error(
        `${variableName} is not configured.`
    );
}


const sequelize =
    new Sequelize(
        databaseUrl,
        {
            logging: false,
        }
    );


export const connectDB =
    async () => {
        try {
            await sequelize.authenticate();

            console.log(
                isTestEnvironment
                    ? 'Test database connection established successfully.'
                    : 'Database connection established successfully.'
            );
        } catch (error) {
            console.error(
                'Unable to connect to the database:',
                error.message
            );

            throw error;
        }
    };


export default sequelize;