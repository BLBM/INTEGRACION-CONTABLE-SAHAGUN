const express = require('express');
const { listaRecibosCaja, detalleReciboCaja, cuentaBancaria,registrarReciboCajaEnviados,prueba} = require('../controllers/integracionPredialController');
const router = express.Router();

router.get('/integracionContableSahagun', prueba);
router.get('/integracionContableSahagun/listaRecibosCaja', listaRecibosCaja);
router.post('/integracionContableSahagun/detalleReciboCaja', detalleReciboCaja);
router.post('/integracionContableSahagun/detalleCuentaBancaria', cuentaBancaria);
router.post('/integracionContableSahagun/registrarReciboCajaEnviados', registrarReciboCajaEnviados);

module.exports = router;