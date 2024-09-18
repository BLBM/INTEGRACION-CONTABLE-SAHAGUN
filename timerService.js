const axios = require('axios');
const dominio = 'http://localhost:7006'; // Asegúrate de que esta URL sea correcta



// Define la función que ejecutará el servicio cada 30 minutos
const ejecutarServicioPeriodicoPredial = () => {
    // Configura un intervalo para ejecutar el servicio cada 30 minutos (30 * 60 * 1000 ms)
    setInterval(async () => {
        try {
            // Ejecuta el servicio
            await axios.get(`${dominio}/integracionContableSahagun/listaRecibosCaja`);
            console.log('Servicio de envio de transacciones para integracion contable se a ejecutado.');
        } catch (error) {
            console.error('Error al ejecutar el servicio:', error);
        }
    }, 1 * 60 * 1000);
  };

  // Exporta la función
module.exports = ejecutarServicioPeriodicoPredial;