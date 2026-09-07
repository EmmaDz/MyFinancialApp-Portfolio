import 'dotenv/config';

import app from './app.js';

import sequelize, {
    connectDB,
} from './config/db.js';


const port =
    process.env.PORT || 4000;


async function startServer() {
    try {
        await connectDB();

        await sequelize.sync({
            force: false,
        });

        app.listen(
            port,
            () => {
                console.log(
                    `http://localhost:${port}`
                );
            }
        );
    } catch (error) {
        console.error(
            'Failed to start server:',
            error.message
        );

        process.exit(1);
    }
}


startServer();