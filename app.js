require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos',
    require('./routes/routes')
);

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('Servidor ejecutándose en puerto 3000');
});

