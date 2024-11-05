// emailTemplates.js

const emailTemplates = {
    confirmacionInscripcion: ({idInscripcion, fechaTramite }) => `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50; text-align: center;">Inscripción de Negocio</h2>
        <p>Nos complace informarle que su negocio ha sido inscrito exitosamente en nuestra plataforma.</p>
        <p><strong>Detalles de la inscripción:</strong></p>
        <ul>
          <li><strong>ID de Inscripción:</strong> ${idInscripcion}</li>
          <li><strong>Fecha De Tramite:</strong> ${fechaTramite}</li>
        </ul>
        <p>Gracias por confiar en nosotros para el crecimiento de su negocio.</p>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #777; font-size: 14px;">Este es un mensaje automático, por favor no responda a este correo.</p>
        </div>
        <div style="text-align: center; padding: 20px;">
            <img src="cid:logoRealsit" alt="Logo de la Empresa" style="width: 150px; margin-bottom: 20px;">
        </div>
        <footer style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
          © 2024 Realsit. Todos los derechos reservados.
        </footer>
      </div>
    `,
    confirmacionAprobacion: ({idInscripcion, fechaTramite }) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50; text-align: center;">Aprobacion de Negocio</h2>
      <p>Nos complace informarle que su negocio ha sido aprobado exitosamente en nuestra plataforma.</p>
      <p><strong>Detalles de la aprobacion:</strong></p>
      <ul>
        <li><strong>ID de Inscripción:</strong> ${idInscripcion}</li>
        <li><strong>Fecha De Tramite:</strong> ${fechaTramite}</li>
      </ul>
      <p>Gracias por confiar en nosotros para el crecimiento de su negocio.</p>
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #777; font-size: 14px;">Este es un mensaje automático, por favor no responda a este correo.</p>
      </div>
      <div style="text-align: center; padding: 20px;">
          <img src="cid:logoRealsit" alt="Logo de la Empresa" style="width: 150px; margin-bottom: 20px;">
      </div>
      <footer style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
        © 2024 Realsit. Todos los derechos reservados.
      </footer>
    </div>
  `
  };
  
  module.exports = emailTemplates;
  