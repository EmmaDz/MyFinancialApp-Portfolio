import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import riskManageRouter from './routes/questionnaireRoute.js';
import 'dotenv/config';
import dotenv from 'dotenv'
import sequelize from './config/db.js';
import portfolioRouter from "./routes/portfolioRoute.js";
import financialProductRouter from "./routes/financialProductRoute.js";
import recommendationRouter from "./routes/recommendationRoute.js";
import './models/associations.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


connectDB()
  .then(() => {
    sequelize.sync({ force: false })
      .then(() => {
        app.listen(port, () => {
          console.log(`http://localhost:${port}`);
        });
      })
      .catch(error => {
        console.error('access failed:', error);
      });
  })
  .catch((error) => {
    console.error('access failed:', error);
  });


app.use("/api/user", userRouter);
app.use('/api/portfolio', portfolioRouter);
app.use("/api/questionnaire", riskManageRouter);
app.use("/api/financialProduct", financialProductRouter);
app.use('/api/recommendations', recommendationRouter);

app.get("/", (req, res) => {
  res.send("api Working");
});