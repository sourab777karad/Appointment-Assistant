import express from 'express';
import AssistantRoutes from './API/Assistant.routes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use("/assistant", AssistantRoutes);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;