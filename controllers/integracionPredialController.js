const client = require('../dataBase/db'); 
const axios = require('axios');


const dominio =  "http://localhost:7006";


exports.prueba = async (req, res) => {
  res.send('Api funcional integracion Contable Sahagun');
};
  


exports.listaRecibosCaja = async (req, res) => {
  try {
    const query = `
    SELECT
    rc.sujeto_pasivo,
    rc.fecha_recaudo,
    rc.consecutivo,
    rc.observacion,
    rc.registrado_por,
    rc.valor_pagado ,
    rc.liquidacion_predio ,
    rc.tipo,
    flp.valor,
    flp.valor_descuento,
    sp.razon_social,
    sp.primer_nombre,
    sp.segundo_nombre,
    sp.primer_apellido,
    sp.segundo_apellido,
    sp.identificacion,
    ti.codigo,
    MAX(d.direccion) AS direccion
FROM
    recibo_caja rc
    LEFT JOIN registro_integracion_contable ric ON rc.consecutivo = ric.recibo_caja
    LEFT JOIN sujeto_pasivo sp ON rc.sujeto_pasivo = sp.consecutivo
    LEFT JOIN tipo_identificacion ti ON sp.tipo_identificacion = ti.codigo
    LEFT JOIN direccion d ON sp.consecutivo = d.sujeto_pasivo
    LEFT JOIN fechas_liquidacion_predio flp on flp.liquidacion_predio = rc.liquidacion_predio 
WHERE
    rc.estado = 'PAGADO'
    AND ric.recibo_caja IS NULL
    AND ric.chequeo_envio IS null
    and rc.valor_pagado  = flp.valor 
    and rc.tipo = 'PREDIOS'   
GROUP BY
    rc.sujeto_pasivo,
    sp.razon_social,
    rc.consecutivo,
    sp.primer_nombre,
    rc.registrado_por,
    rc.observacion,
    rc.fecha_recaudo,
    rc.tipo,
    rc.valor_pagado ,
    rc.liquidacion_predio ,
    flp.valor,
    flp.valor_descuento,
    sp.segundo_nombre,
    sp.primer_apellido,
    sp.segundo_apellido,
    sp.identificacion,
    ti.codigo
   limit 1;
    `;
    //AND rc.liquidacion_predio = '188'
    /*
    CREDENCIALES DE PRODUCCION

    const baseURL = "https://sahagun.software-genesis.com/genesis/";
    const usuario = "predial";
    const token = "25ca9445b0aca8ee36dc5523591bb820";

    CREDENCIALES DE DESARROLLO

    const baseURL = "https://prueba.software-genesis.com/genesis/webresources/tesoreria";
    const usuario = "APIPrueba";
    const token = "b19f009eb0a94d6832b98cb3fe5a7605";
    */

    const baseURL = "https://prueba.software-genesis.com/genesis/webresources/tesoreria";
    const usuario = "APIPrueba";
    const token = "b19f009eb0a94d6832b98cb3fe5a7605";
    const result = await client.query(query);
    const registrosTerceros = result.rows.map(row => {
      const tipo = row.codigo === 2 ? 2 : 1;
     // console.log(tipo);
      return {
        tipo,
        cc_nit: row.identificacion,
        pnombre: row.primer_nombre || "",
        onombre: row.segundo_nombre || "",
        papellido: row.primer_apellido || "",
        oapellido: row.segundo_apellido || "",
        razonsocial: row.razon_social || "",
        ubicacion: "2366000",
        direccion: row.direccion,
        email:"",
        telefono:""       
      };
    });
    
    var concepto;
    const valoresReciboCaja= result.rows.map(row=>{
      if (row.observacion.includes("null") || row.observacion.includes("[]")) {
        concepto = row.observacion.replace("null", "");
        concepto = concepto.replace("[]","");
      }else{
      concepto = row.observacion;
      }

      return{       
        tipo:"E",
        codigo:"",
        consecutivo:row.consecutivo,
        fecha_registro:row.fecha_recaudo,
        cc_nit:row.identificacion,
        concepto,
        registropor:row.registrado_por,
        valorpagado:row.valor,
        valordescuento:row.valor_descuento,
        liquidacionPredio: row.liquidacion_predio 
      }
    });
    
    // Llamada a la función para procesar y enviar registros de terceros queda en stand by
    const resultados = await procesarRegistrosTerceros(registrosTerceros, `${baseURL}/registro_tercero`, usuario, token);

    // Enviar respuesta al cliente
      //res.json(resultados);
    // Llamada a la funcion para procesar el recibo caja y sus detalles
    const procesarDetalleReciboscaja = await procesarDetalleReciboCaja(valoresReciboCaja, `${baseURL}/registro_ingresos?tipo=11`, usuario, token);

    res.status(200).json(procesarDetalleReciboscaja);


  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Función para enviar una solicitud PUT a la URL proporcionada con los encabezados dados
async function enviarRegistroTercero(registro, url, usuario, token) {
  const headers = {
    'Content-Type': 'application/json',
    'usuario': usuario,
    'token': token
  };

  try {
    
    const response = await axios.put(url, registro, { headers });
    console.log('Respuesta de la solicitud PUT api Genesis:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar la solicitud PUT:', error);
    throw error;
  }
}

// Función para procesar la lista de registros de terceros y enviar solicitudes PUT para cada uno
async function procesarRegistrosTerceros(registros, url, usuario, token) {
  const resultados = [];
  for (const registro of registros) {
    try {
      const resultado = await enviarRegistroTercero(registro, url, usuario, token);
      resultados.push(resultado);
      //console.log(registro);
    } catch (error) {
      console.error('Error procesando el registro:', error);
    }
  }
  return resultados;
}


async function enviarDetalleReciboCaja(registro, url, usuario, token) {
  const headers = {
    'Content-Type': 'application/json',
    'usuario': usuario,
    'token': token
  };

  // Función para transformar el JSON
  function transformarRegistro(registro) {
    return registro.map(objeto => {
      if (objeto.tipo === 'E') {
        const { registropor, consecutivo, valorpagado, liquidacionPredio,valordescuento, ...resto } = objeto;

      // Formatear la fecha al formato "dd/MM/yyyy"
      const fecha = new Date(objeto.fecha_registro);
      const dia = "21";//String(fecha.getDate()).padStart(2, '0');
      const mes = "11";//String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexed
      const año = "2023";//fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;

        return {
          ...resto,
          fecha_registro: fechaFormateada
        };
      }
      return objeto;
    });
  }

  try {
    // Transformar el registro antes de enviarlo
    const registroTransformado = transformarRegistro(registro);
    
    const formattedRegistro = JSON.stringify(registroTransformado);
    console.log(formattedRegistro);
    //console.log(url);

    // Descomentar la línea siguiente para realizar la solicitud POST
    const response = await axios.post(url, formattedRegistro, { headers });
    console.log('Respuesta de la solicitud POST api Genesis:', response.data);
    return ("operacion realizada con exito", response.data);
  } catch (error) {
    console.error('Error al enviar la solicitud POST:', error);
    throw error;
  }
}

async function procesarDetalleReciboCaja(valoresRecibosCaja,url, usuario, token) {
  
  try {
    var valoresAEnviarIntegracion =[];
     
    

    for (var reciboCaja of valoresRecibosCaja) {
      valoresAEnviarIntegracion =[];


      // CUANDO CONSULTE EL RECIBO REALIZAR UN CONDICIONAL QUE IDENTIFIQUE QUE TIPO DE RECIBO ES
      // SI ES PREDIOS CONTINUA CON EL PROCESO
      // SI ES ACTIVIDAD ECONOMICA REALIZA UN PROCESO DISTINTO

      try {
        
        const fetchconsultarDetallesReciboCaja = await axios.post(`${dominio}/integracionContableSahagun/detalleReciboCaja`, {
          liquidacionPredio: reciboCaja.liquidacionPredio,
          valorDescuento: reciboCaja.valordescuento
          
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const informacionDetalleReciboCaja = await fetchconsultarDetallesReciboCaja.data;


  
        valoresAEnviarIntegracion.push(reciboCaja);

        var informacionBancaria ={};
        if(reciboCaja.registrado_por=="PSE" || reciboCaja.registrado_por=="WEBSERVICE"){
          informacionBancaria={
            "tipo":"B",
            "codigo":"09387788024",
            "valor":parseFloat(reciboCaja.valorpagado)
          }
        }else{

          const fetchconsultarCuentaBancaria = await axios.post(`${dominio}/integracionContableSahagun/detalleCuentaBancaria`, {
            numeroReciboCaja: reciboCaja.consecutivo
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const informacionCuentaBancaria = await fetchconsultarCuentaBancaria.data;
          
          informacionBancaria={
            "tipo":"B",
            "codigo":informacionCuentaBancaria[0].numero,
            "valor":parseFloat(reciboCaja.valorpagado)
          }        
        }      

         // BORRAR CUANDO ACABE

        // Agregar cada detalle como una nueva entrada al arreglo de nuevos valores de recibo de caja
        for (var detalle of informacionDetalleReciboCaja) {
          valoresAEnviarIntegracion.push(detalle);
        }
        valoresAEnviarIntegracion.push(informacionBancaria);
        var jsonEnviado = JSON.stringify(valoresAEnviarIntegracion);


        try {
          // CODIGO DE ENVIO DE DATOS A LA INTEGRACION CONTABLE
          var resultadosProcesadoReciboCaja=[];
          const resultado = await enviarDetalleReciboCaja(valoresAEnviarIntegracion, url, usuario, token);
          resultadosProcesadoReciboCaja.push(resultado);
          
        
          // Verificar si todos los elementos de resultadosProcesadoReciboCaja son números
          const todosSonNumeros = resultadosProcesadoReciboCaja.every(item => typeof item === 'number');
        
          if (todosSonNumeros) {

            // CODIGO DE REGISTRO DE ENVIO DE LOS DATOS
           // Asegurar que el resultado es una cadena
            const resultadoStr = JSON.stringify(resultado);

            // Extraer solo los dígitos del resultado usando una expresión regular
            const numeroResultado = parseInt(resultadoStr.match(/\d+/)[0]);

            const registrarDatosEnviados = await axios.post(`${dominio}/integracionContableSahagun/registrarReciboCajaEnviados`, {
              numeroReciboCaja: reciboCaja.consecutivo,
              jsonEnviado,
              IDdescargue: numeroResultado // SE CAMBIA CUANDO SE INCLUYA EL SERVICIO DE LA INTEGRACION CONTABLE
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
        
            console.log("datos registrados");
            const dataDeLosDatosEnviados = await registrarDatosEnviados.data;
          } else {
            console.log("No se registran los datos porque se presento un error");
          }
        } catch (error) {
          console.error('Error enviando o registrando datos', error);
        }
        



      } catch (error) {
        console.error('Error procesando el recibo de caja:', error);
      }
    }

    return resultadosProcesadoReciboCaja;

  } catch (error) {
    console.error('Error procesando los detalles del recibo de caja:', error);
    throw error;
  }
}

//ENDPOINT DE DETALLE RECIBO CAJA
exports.detalleReciboCaja = async (req, res) => {
  try {
    const dataRegistro = req.body;
    const query = `
      SELECT 
        dlpddp.accesorio,
        dlpddp.valor,
        dp.vigencia,
        op.tipo_predio 
      FROM
        detalle_liquidacion_predio_detalle_deuda_predio dlpddp
        LEFT JOIN deuda_predio dp ON dlpddp.deuda_predio = dp.consecutivo
        left join oi_predio op on dp.oi_predio =op.consecutivo
      WHERE
        dlpddp.liquidacion_predio = $1`;

    const values = [dataRegistro.liquidacionPredio];
    const result = await client.query(query, values);

    // Verificar si se encontraron detalles para la liquidación de predio
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron detalles para la liquidación de predio especificada' });
    }

    const currentYear = new Date().getFullYear();
    const groupedDetails = {};
    let valorDescuento = parseFloat(dataRegistro.valorDescuento); // Variable para almacenar el valor total del descuento
    var tipoPredio = '';
    // console.log(valorDescuento);
    // Procesar cada detalle del resultado y agruparlos según los criterios especificados
    result.rows.forEach(row => {
      const accesorio = row.accesorio;
      tipoPredio = row.tipo_predio === '00' ? '00': '01';
      console.log(tipoPredio);
      let tipo, codigo;

      // Determinar el tipo y código según los criterios especificados y la vigencia
      if ([201, 724].includes(accesorio)) {
        tipo = 'D';
        if (row.tipo_predio === '00') {
          codigo = currentYear === parseFloat(row.vigencia) ? '224' : '226';      
        }  else{
          codigo = currentYear === parseFloat(row.vigencia) ? '223' : '225';
        }
      } else if ([602, 714].includes(accesorio)) {
        tipo = 'D';
        codigo = currentYear === parseFloat(row.vigencia) ? '38' : '153';
      } else if ([202, 718].includes(accesorio)) {
        tipo = 'D';
        codigo = currentYear === parseFloat(row.vigencia) ? '24' : '154';
      } else if ([203, 724].includes(accesorio)) {
        tipo = 'D';
        codigo = '46';
      } else if ([604, 716].includes(accesorio)) {
        tipo = 'D';
        codigo = '239';
      } else if ([204,720].includes(accesorio)) {
        tipo = 'D';
        codigo = '203';
      } else if ([205, 215, 217, 218, 702, 704, 706, 708, 710, 712, 726, 728].includes(accesorio)) {
        tipo = 'S';
        if (tipoPredio === '00') {
          codigo = 276
        } else if (tipoPredio === '01') {
          codigo = 275
        }else{
          codigo = 275
        }
      }



      // Agrupar y sumar los valores según la vigencia
      if (tipo && codigo) {
        const key = `${tipo}_${codigo}`;
        if (!groupedDetails[key]) {
          groupedDetails[key] = {
            tipo,
            codigo,
            valor: 0
          };
        }
        groupedDetails[key].valor += Math.abs(parseFloat(row.valor));
      }

    });


// Si hay un valor de descuento y no hay grupo 'S', agregar el grupo 'S' con el valor del descuento
if (valorDescuento > 0) {
  if (!groupedDetails['S_275']) {
    groupedDetails['S_275'] = {
      tipo: 'S',
      codigo: tipoPredio === '01' ? '275': '276',
      valor: Math.abs(parseFloat(valorDescuento))
    };
  } else {
    // Si el grupo 'S_100' ya existe, sumar el valor del descuento al valor existente
    groupedDetails['S_275'].valor += Math.abs(parseFloat(valorDescuento));
  }
}


    // Convertir los grupos de detalles agrupados en arreglos
    const groupedDetailsArray = Object.values(groupedDetails);
   // console.log(groupedDetailsArray);
    // Enviar el arreglo de detalles agrupados como respuesta
    res.status(200).json(groupedDetailsArray);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




//ENDPOINT DE CUENTA BANCARIA

exports.cuentaBancaria = async (req, res) => {
  try{
  const dataReciboCaja = req.body.numeroReciboCaja;
  const query=`
      select 
        cb.numero
      from 
        detalle_recibo_caja drc 
        left join banco_impuesto bi on drc.banco_impuesto  = bi.consecutivo
        left join cuenta_bancaria cb on bi.cuenta_bancaria  = cb.consecutivo 
      where 
        recibo_caja=$1
      limit 1;
`;
  const values = [dataReciboCaja];
  const result = await client.query(query, values);
  //console.log(result);
  res.status(200).json(result.rows);
}catch{
  console.error('Error al procesar la solicitud:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

};
//registrarReciboCajaEnviados
exports.registrarReciboCajaEnviados = async (req, res) => {
    try {
      const valoresAGuardar = req.body;
      const fechaCargue = new Date(); // Obtiene la fecha y hora actual
      //console.log(valoresAGuardar);
      const query = 'insert into registro_integracion_contable (recibo_caja,chequeo_envio,json_enviado,iddescargue,fecha_de_cargue) VALUES ($1, $2, $3, $4,$5)';
      const values = [valoresAGuardar.numeroReciboCaja, "SI", valoresAGuardar.jsonEnviado, valoresAGuardar.IDdescargue, fechaCargue];
      const result = await client.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) { // Aquí se define el objeto error
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };


// Define la función que ejecutará el servicio cada 30 minutos
const ejecutarServicioPeriodico = () => {
  // Configura un intervalo para ejecutar el servicio cada 30 minutos (30 * 60 * 1000 ms)
  setInterval(async () => {
      try {
          // Ejecuta el servicio
          await axios.get(`${dominio}/integracionContableSahagun/listaRecibosCaja`);
          console.log('Servicio de envio de transacciones para integracion contable se a ejecutado.');
      } catch (error) {
          console.error('Error al ejecutar el servicio:', error);
      }
  }, 30 * 60 * 1000);
};
    
  
   