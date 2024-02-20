import express from 'express';
import AssistantRoutes from './API/Assistant.routes.js';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
// using helmet to secure the app by setting various HTTP headers
app.use(helmet());
// using cors to allow cross-origin requests
app.use(cors());
app.use(express.json());

app.use("/assistant", AssistantRoutes);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;