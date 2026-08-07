import Sequelize from 'sequelize';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not configured. Copy .env.example to .env and provide a valid MySQL connection string.'
  );
}

const sequelize = new Sequelize(databaseUrl, {
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
};

export default sequelize;