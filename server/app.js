import express from 'express';
import cors from 'cors';

import userRouter
    from './routes/userRoute.js';

import riskManageRouter
    from './routes/questionnaireRoute.js';

import portfolioRouter
    from './routes/portfolioRoute.js';

import financialProductRouter
    from './routes/financialProductRoute.js';

import recommendationRouter
    from './routes/recommendationRoute.js';

import './models/associations.js';


const app = express();


app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


app.use(
    '/api/user',
    userRouter
);

app.use(
    '/api/portfolio',
    portfolioRouter
);

app.use(
    '/api/questionnaire',
    riskManageRouter
);

app.use(
    '/api/financialProduct',
    financialProductRouter
);

app.use(
    '/api/recommendations',
    recommendationRouter
);


app.get(
    '/',
    (req, res) => {
        res.send('api Working');
    }
);


export default app;