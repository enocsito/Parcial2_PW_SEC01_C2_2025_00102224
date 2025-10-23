import express from 'express';
import apiRoutes from './routes/api.routes.js';

const app = express();
const PORT = 3130;

app.use(express.json());

app.use('/', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});