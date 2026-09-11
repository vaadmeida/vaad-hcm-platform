import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.route.ts';
import employeeRouter from './modules/employees/employee.route.ts';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.ts";
import { errorHandler } from './middlewares/errorHandler.ts';
import leaveRouter from './modules/leave/leave.route.ts';
import dashboardRouter from './modules/dashboard/dashboard.route.ts';
import departmentRouter from './modules/department/department.route.ts';
import locationRouter from './modules/location/location.route.ts';
import settingRouter from './modules/settings/settings.route.ts';
import documentRouter from './modules/documents/document.route.ts';

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://vaad-hcm-platform.vercel.app",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/leaves', leaveRouter)
app.use('/api/documents', documentRouter)
app.use('/api/dashboard' , dashboardRouter)
app.use('/api/departments' , departmentRouter)
app.use('/api/locations' , locationRouter)
app.use('/api/settings' , settingRouter)


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Api is working perfectly');
})

export default app;