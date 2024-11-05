const express = require('express');
const nodemailer = require('nodemailer');
const client = require('../dataBase/db');
const emailTemplates = require('../constantes/emailTemplates');

const dominio =  "http://localhost:7006";

exports.pruebaNotificacionIae = async (req, res) => {
    console.log('probando logs de la apis')
    res.send('Api funcional notificacion de correo IAE');
  };

  

// Exportación de la función principal
exports.notificacionInscripcionNegocioIae = async (req, res) => {
  const { numeroInscripcion,tipoCorreo } = req.query; // Captura el `id` desde la URL
  const query = `SELECT * FROM inscripcion_oi_iae ioi WHERE numero_tramite_inscripcion = $1;`;
  const values = [numeroInscripcion];
  
  try {
      const result = await client.query(query, values);
      const emailUsuario = result.rows[0].fax;
      const fechaTramite = result.rows[0].fecha_tramite;
      const idInscripcion = numeroInscripcion;
      

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'veneno156@gmail.com', 
              pass: 'azig omfl atke wwxf' // Usa la contraseña de aplicación aquí
          }
      });

      // Llama a la función para enviar el correo
      await enviarCorreo(transporter, emailUsuario, idInscripcion, fechaTramite,tipoCorreo);
      res.status(200).send({ message: 'Correo de notificación enviado correctamente' });
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error al enviar el correo de notificación' });
  }
};


// Función para enviar el correo de confirmación
async function enviarCorreo(transporter, emailUsuario, idInscripcion, fechaTramite,tipoCorreo) {
    let asuntoCorreo
    let htmlContent;
    if (tipoCorreo === 'inscripcion') {
        asuntoCorreo =  'Inscripción de Negocio';
        htmlContent = emailTemplates.confirmacionInscripcion({
            idInscripcion,
            fechaTramite,
        });
    } else if (tipoCorreo === 'aprobacion') {
        asuntoCorreo = 'Aprobacion de Negocio',
        htmlContent = emailTemplates.confirmacionAprobacion({
            idInscripcion,
            fechaTramite,
        });
    } 

  const mailOptions = {
      from: 'veneno156@gmail.com',
      to: emailUsuario,
      subject: 'Confirmación de Inscripción de Negocio',
      html: htmlContent,
      attachments: [
          {
              filename: 'logoRealsit.png',
              path: './assets/logoRealsit.png', // Ruta local de la imagen
              cid: 'logoRealsit' // Este `cid` se usa para hacer referencia en el HTML
          }
      ]
  };

  // Envía el correo aquí
  await transporter.sendMail(mailOptions);
}