import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.route.ts';
import employeeRouter from './modules/employees/employee.route.ts';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.ts";
import { errorHandler } from './middlewares/errorHandler.ts';
import leaveRouter from './modules/leave/leave.route.ts';

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/leaves', leaveRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Api is working perfectly');
})

export default app;