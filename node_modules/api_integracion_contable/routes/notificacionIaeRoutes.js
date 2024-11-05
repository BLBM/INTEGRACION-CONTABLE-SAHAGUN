
const express = require('express');
const { pruebaNotificacionIae,notificacionInscripcionNegocioIae} = require('../controllers/notificacionIaeController');
const router = express.Router();

router.get('/notificacionIae/pruebaNotificacionIae', pruebaNotificacionIae);
router.get('/notificacionIae/notificacionInscripcionNegocioIae/', notificacionInscripcionNegocioIae);


module.exports = router;