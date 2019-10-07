//como usaremos un metodo de passport para poder autenticar nos lo traeremos al controller

const passport = require("passport");
const Usuarios = require("../models/Usuarios");
//este metodo propio de node js permite generar tokens
const crypto = require("crypto");

//nos traemos el bcrypt para hashear el password que se va reestablecer
const bcrypt = require("bcrypt-nodejs");

//traemos Sequealize porque vamos a generar un metodo
//que permite hacer comparaciones, en este caso para comparar
//que el tiempo actual no haya superado al tiempo expiracion del token
const Sequealize = require("sequelize");
const Op = Sequealize.Op;

const { enviar } = require("../handlers/email");

//el primer parametro que pasamos es la estrategia, dicha estrategia cambia segun lo que queramos o metodo que queramos
//para autenticar, si fuera facebook, en vez de local , la estrategia seria facebook
exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  //para hacer los mensajes que definimos para errores visibles usamos
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios"
});

//a continuacion vamos a verificar que usuario ya este autenticado y dependiendo de esto, vemos si tiene
//acceso o no al endpoint al que quiere acceder.
exports.usuarioAutenticado = (req, res, next) => {
  //si el usuario esta autenticado
  if (req.isAuthenticated()) {
    return next();
  }
  //si el usuario no esta autenticado
  return res.redirect("/iniciar-sesion");
};

//esta funcion es para evitar que quieran entrar al area de iniciar sesion si ya estan autenticados
exports.yaIniciasteSesion = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

//middleware para cerrar sesion
exports.cerrarSesion = (req, res) => {
  //con esto decimos que de la peticion tomaremos aquella que dice que va a acabar con la sesion actual
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

//metodo para generar un token con los datos que recibimos
//desde /reestablecer
//es peticion asincrona porque del modelo usuario es de donde
//autenticaremos que el correo exista
exports.enviarToken = async (req, res) => {
  //destructurin de los datos que vienen por peticion
  const { email } = req.body;
  //hacemos peticion con el dato email, para ver si existe
  const usuario = await Usuarios.findOne({
    where: {
      email
    }
  });
  //sino existe el usuario? retornamos un mensaje error con connect-flash
  if (!usuario) {
    //con el flash indicamos, primero la categoria que es error
    //y luego el mensaje que dara esa categoria
    req.flash("error", "No existe esa cuenta");
    res.redirect("/reestablecer");
  }
  //verificada que la cuenta existe creamos un token, y su expiracion para que no venga cualquiera y haga cambios indeseados
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;
  //habiendo asignado valores los guardamos en el usuario al que corresponde
  await usuario.save();
  //ya generado esto creamos una ruta la cual accedera este usuario donde se va resetear su clave
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  //debugueamos con un console.log
  //console.log(resetUrl);

  //enviamos el token del resetUrl para que recupere la contraseña
  await enviar({
    usuario,
    subject: "Password Reset",
    resetUrl,
    archivo: "reestablecer-password"
  });

  req.flash("correcto", "se envio un mensaje a tu correo");
  res.redirect("/iniciar-sesion");
};

exports.validarToken = async (req, res) => {
  //extraemos el comodin de la url
  const { token } = req.params;
  //verificamos que el token corresponda con el correo o que exista si quiera ese token en el modelo
  const usuario = await Usuarios.findOne({
    where: {
      token
    }
  });
  //condicional en caso de que no exista el usuario
  if (!usuario) {
    req.flash("error", "No valido");
    res.redirect("/reestablecer");
  }
  //en caso de que exista vamos a redirigir hacia la vista de resetPassword
  res.render("resetPassword", {
    nombrePagina: "Reestablece tu Password"
  });
};

exports.actualizarPassword = async (req, res) => {
  //obtenemos el dato de params que viene por la url mediante destructuring
  const { token } = req.params;
  //verificamos que el token corresponda al usuario en la base de datos, pero tambien
  //que el token no haya caducado
  const usuario = await Usuarios.findOne({
    where: {
      token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  });
  //validamos que exista o que no haya caducado con una condicion
  if (!usuario) {
    req.flash("error", "No valido");
    res.redirect("/reestablecer");
  }
  //una vez superada la se procede a modificar la password y a eliminar el token y su caducidad
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  //teniendo estos datos ya arreglados procedemos a guardar en la base de datos
  await usuario.save();

  //luego de esto redirigimos hacia el endpoint de iniciar sesion
  req.flash("correcto", "Tu contraseña ha sido reestablecida");
  res.redirect("/iniciar-sesion");
};
