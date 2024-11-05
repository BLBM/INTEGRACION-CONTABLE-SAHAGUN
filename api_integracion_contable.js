const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const integracionPredialRoutes = require('./routes/integracionPredialRoutes');
const ejecutarServicioPeriodicoPredial = require('./timerService');  
const notificacionIaeRoutes = require ('./routes/notificacionIaeRoutes');


const app = express();
const PORT = 7006;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



// Usa las rutas importadas
app.use(integracionPredialRoutes);
app.use(notificacionIaeRoutes);
app.use('/assets', express.static('assets'));


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

    // Llama la función del servicio periódico
    //ejecutarServicioPeriodicoPredial();
});
