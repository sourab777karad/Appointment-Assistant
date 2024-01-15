import express from 'express';
import kakshaRoutes from './api/kaksha.Routes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use("/kaksha", kakshaRoutes);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;