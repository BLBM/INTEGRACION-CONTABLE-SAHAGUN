// emailTemplates.js

const emailTemplates = {
  confirmacionInscripcion: ({ idInscripcion }) => `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>Respetado(a) contribuyente:</p>
        <p>
          Por parte de la Secretaría de Hacienda Municipal de Sahagún le informa que su
          solicitud de inscripción en el Registro de informacion Tributaria del impuesto de
          Industria y Comercio fue radicada con el numero de radicado
          <strong>No. ${idInscripcion}</strong>, conforme al documento adjunto.
        </p>
        <p>Atentamente,</p>
        <p>
          SECRETARÍA DE HACIENDA MUNICIPAL<br>
          MUNICIPIO DE SAHAGÚN - CÓRDOBA
        </p>
        <p style="font-size: 14px; color: #555;">
          <strong>Nota:</strong> <strong>Recuerde que puede reimprimir su solicitud de inscripción o aprobación de
          inscripción a través de nuestro enlace:</strong> <a href="#" style="color: #0056b3;">XXXXXXXXXXXXXXXXXXXXXXXXX</a>
        </p>
        <footer style="position: relative; font-size: 12px; color: #777; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          Este es un mensaje automático, por favor no responda a este correo.
          <div style="position: absolute; bottom: 0; left: 0; padding: 10px;">
            <img src="cid:logoRealsit" alt="Logo de la Empresa" style="width: 100px;">
          </div>
        </footer>
      </div>
    `,
    confirmacionAprobacion: ({ idInscripcion }) => `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p>Respetado(a) contribuyente:</p>
      <p>
        Por parte de la Secretaría de Hacienda Municipal de Sahagún le informamos que su
        solicitud de inscripción en el Registro de Información Tributaria del Impuesto de Industria y Comercio fue aprobada, 
        conforme a los documentos presentados por el interesado. La misma se encuentra bajo el radicado 
        <strong>No. ${idInscripcion}</strong>, conforme al documento adjunto.
      </p>
      <p>Se adjunta Guía práctica sobre la liquidación de sus impuestos.</p>
      <p>
        <strong>Nota:</strong> Recuerde que puede reimprimir su solicitud de inscripción o aprobación de inscripción a través de nuestro enlace: 
        <a href="#" style="color: #0056b3;">XXXXXXXXXXXXXXXXXXXXXXXXX</a>
      </p>
      <p>
        Atentamente,<br>
        <strong>SECRETARÍA DE HACIENDA MUNICIPAL</strong><br>
        MUNICIPIO DE SAHAGÚN - CÓRDOBA
      </p>
      <footer style="position: relative; font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
        Este es un mensaje automático, por favor no responda a este correo.
        <div style="position: absolute; bottom: 0; left: 0; padding: 10px;">
          <img src="cid:logoRealsit" alt="Logo de la Empresa" style="width: 100px;">
        </div>
      </footer>
    </div>
  `
  };
  
  module.exports = emailTemplates;
  