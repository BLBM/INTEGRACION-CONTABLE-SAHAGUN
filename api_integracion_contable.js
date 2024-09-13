const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const integracionPredialRoutes = require('./routes/integracionPredialRoutes');
const ejecutarServicioPeriodicoPredial = require('./timerService');  

const app = express();
const PORT = 7006;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Usa las rutas importadas
app.use(integracionPredialRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

    // Llama la función del servicio periódico
    //ejecutarServicioPeriodicoPredial();
});
