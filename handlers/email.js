const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");
//por convension se crea la carpeta handlers que serian como los manejadores

//creamos el transport con nuestra configuracion
let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user, // generated ethereal user
    pass: emailConfig.pass // generated ethereal password
  }
});

//generar html
const generarHtml = (archivo, opciones = {}) => {
  //en estas constante vamos a importar el contenido del view mediante un metodo de pug
  //introducimos en un template-string algo que dice, que de donde estamos o sea __dirname y la ruta exacta del lugar, de donde extraera el template
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${archivo}.pug`,
    opciones
  );
  //con esto asumira todos los estilo lineales
  return juice(html);
};

exports.enviar = async opciones => {
  const html = generarHtml(opciones.archivo, opciones);
  const text = htmlToText.fromString(html);

  let opcionesEmail = {
    from: "UpTask <no-reply@uptask.com>", // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html // aqui modificamos el string por la funcion generarHtml
  };
  //como para esta version de nodemailer, el sendMail no aguantaba el await, con el util de node podemos hacerlo
  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport, opcionesEmail);
};
