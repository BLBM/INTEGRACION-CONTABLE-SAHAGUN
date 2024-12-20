const express = require('express');
const nodemailer = require('nodemailer');
const client = require('../dataBase/db');
const emailTemplates = require('../constantes/emailTemplates');
const crypto = require('crypto');
const algorithm = 'aes-128-ecb';
const secretKey = Buffer.from('2025202420232022', 'utf-8');

const dominio =  "http://localhost:7006";

exports.pruebaNotificacionIae = async (req, res) => {
    res.send('Api funcional notificacion de correo IAE');
  };

  
// Exportación de la función principal
exports.notificacionInscripcionNegocioIae = async (req, res) => {
  const { numeroInscripcion,tipoCorreo } = req.query; // Captura el `id` desde la URL
  //const idInscripcion = decrypt(numeroInscripcion);
  const idInscripcion =numeroInscripcion;
  const query = `SELECT * FROM inscripcion_oi_iae ioi WHERE numero_tramite_inscripcion = $1;`;
  const values = [idInscripcion];
  
  try {
      const result = await client.query(query, values);
      const emailUsuario = result.rows[0].fax;
      const fechaTramite = result.rows[0].fecha_tramite;
      
      

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
        asuntoCorreo =  `Constancia radicación de solicitud inscripción RIT - ICA No. ${idInscripcion} Secretaría de Hacienda de Sahagún`;
        htmlContent = emailTemplates.confirmacionInscripcion({
            idInscripcion,
            fechaTramite,
        });
    } else if (tipoCorreo === 'aprobacion') {
        asuntoCorreo = `Aprobación de solicitud inscripción RIT - ICA No. ${idInscripcion} Secretaría de Hacienda de Sahagún`;
        htmlContent = emailTemplates.confirmacionAprobacion({
            idInscripcion,
            fechaTramite,
        });
    } 

  const mailOptions = {
      from: 'veneno156@gmail.com',
      to: emailUsuario,
      subject: asuntoCorreo,
      html: htmlContent,
      attachments: [
          {
              filename: 'logoRealsit.png',
              path: './assets/logoRealsit.png', // Ruta local de la imagen
              cid: 'logoRealsit' // Este `cid` se usa para hacer referencia en el HTML
          },
          {
            filename: 'archivo.pdf',
            path: './assets/archivo.pdf', // Ruta al archivo PDF
            contentType: 'application/pdf'
          }
      ]
  };

  // Envía el correo aquí
  await transporter.sendMail(mailOptions);
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, null); // Sin IV en ECB
    decipher.setAutoPadding(true); // Asegúrate de usar padding

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}