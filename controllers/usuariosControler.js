//SE CREA LOS CONTROLERS ASOCIADOS A CREAR UNA CUENTA

//traemos el Usarios de model para poder hacer uso de esa coleccion

const Usuarios = require("../models/Usuarios");

const { enviar } = require("../handlers/email");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crea Tu cuenta de Uptask"
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Inicia Sesion en Uptask",
    error
  });
};

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;
  //USAREMOS TRY CATCH PS: ESTO SE USA PARA MANEJAR ERRORES, NO PARA PREVENIRLOS, SOLO SABE QUE HACER CUANDO UN ERROR
  //OCURRE, YA QUE DE CIERTO TIENE EL MEME QUE DICE QUE CON TRY CATHC "NO HABRA ERRORES", Y AUNQUE SI LOS HAY,
  //EL TRY SABE COMO MANEJARLOS COMO PARA QUE PAREZCA QUE NO

  try {
    await Usuarios.create({
      password,
      email
    }); //el .then ya no hace falta con el try catch

    //crear una URL de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    //crear el objeto de usuario
    const usuario = {
      email
    };

    //enviar email
    await enviar({
      usuario,
      subject: "Confirma tu cuenta UpTask",
      confirmarUrl,
      archivo: "confirmar-cuenta"
    });

    //redirigir al usuario
    req.flash("correcto", "Te enviamos un correo de confirmacion");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error.errors.map(error => error.message));
    res.render("crearCuenta", {
      //este error es visible porque al tipar de manera mas fuerte el modelo el envia o retorna como error eso
      //a la barra de comandos, de manera que al generar el error nos traemos ese mensaje que enviamos con sequilize
      //errores: error.errors,
      //UPDATE, para hacer el trabajo mejor usaremos flash, de manera que el administrara los mensajes, y ademas
      //enviara la cantidad de mensajes necesarios segun se requiera o necesite.
      mensajes: req.flash(),
      nombrePagina: "Crear Cuenta en Uptask",
      //pasamos estos datos en caso de error para que solo muestre los errores de lo que realmente falte
      email,
      password
    });
  }
};

exports.formRestablecerContraseña = (req, res) => {
  res.render("reestablecer", {
    nombrePagina: "Reestablecer Contraseña"
  });
};

//con este middle cambiamos el estado de nuestras cuentas al ser confirmada
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });

  if (!usuario) {
    req.flash("error", "No valido");
    res.redirect("/crear-cuenta");
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash("correcto", "Su cuenta ha sido confirmada");
  res.redirect("/iniciar-sesion");
};
