//para las rutas se tiene un archivo aparte
//para tener express disponible debemos traerlo

const express = require("express");

//para poder usar las rutas usamos un metodo
//propio de express llamado router

const router = express.Router();

//exportamos del controller los llamados a la ruta
const proyectosController = require("../controllers/proyectosControlers");
const tareasController = require("../controllers/tareasControlers");
const usuariosController = require("../controllers/usuariosControler");
const authControler = require("../controllers/authControler");

//aplicamos destructuring para traer para traer los controlers
const {
  proyectosHome,
  formularioProyecto,
  nuevoProyecto,
  proyectoPorUrl,
  formularioEditar,
  editarProyecto,
  eliminarProyecto
} = proyectosController;

//traemos el controlador de tareas y aplicamos destructuring

const { crearTarea, cambiarEstadoTarea, eliminarTarea } = tareasController;

const {
  formCrearCuenta,
  crearCuenta,
  formIniciarSesion,
  formRestablecerContraseña,
  confirmarCuenta
} = usuariosController;

const {
  autenticarUsuario,
  usuarioAutenticado,
  cerrarSesion,
  yaIniciasteSesion,
  enviarToken,
  validarToken,
  actualizarPassword
} = authControler;

//AQUI EN LAS RUTAS ES DONDE VALIDAMOS LA INFORMACION A TRAVES DEL MIDDLEWARE QUE SE GENERA EN ELLAS
//ya que en el proyectosControler es req.body lo que recibimos eso validamos, o es el metodo a validar
const { body } = require("express-validator/check");

//ahora hacemos la conexion con las rutas
//pero para tenerlo disponible en el
//archivo principal (index.js) debemos exportarlo
//export no sirve de forma nativa se usa module.exports

module.exports = function() {
  //se cambia el metodo de use por get
  //para obtener en la peticion
  //get es para obtener la pagina o la ruta para que se vea
  router.get("/", usuarioAutenticado, proyectosHome);
  router.get("/nuevo-proyecto", usuarioAutenticado, formularioProyecto);
  //con post mandamos informacion y definimos la direccion a donde va
  router.post(
    "/nuevo-proyecto",
    usuarioAutenticado,
    //aqui es donde colocamos el validator
    body("nombre")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    nuevoProyecto
  );
  //ruta donde se muestra el proyecto
  router.get("/proyectos/:url", usuarioAutenticado, proyectoPorUrl);
  //ruta donde editamos el proyecto
  router.get("/proyecto/editar/:id", usuarioAutenticado, formularioEditar);
  //router para mandar la informacion de la edicion
  router.post(
    "/nuevo-proyecto/:id",
    usuarioAutenticado,
    body("nombre")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    editarProyecto
  );
  //ruta para eliminar proyectos
  router.delete("/proyectos/:url", usuarioAutenticado, eliminarProyecto);
  //ruta para crear tareas de los proyectos
  router.post(
    "/proyectos/:url",
    usuarioAutenticado,
    body("tarea")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    crearTarea
  );

  //area para tareas

  //ruta donde se hace la peticion para cambiar el estado
  router.patch("/tareas/:id", usuarioAutenticado, cambiarEstadoTarea);
  //ruta para la peticion de eliminar una tarea
  router.delete("/tareas/:id", usuarioAutenticado, eliminarTarea);

  //area para la cuentas

  //vista cuentas
  router.get("/crear-cuenta", formCrearCuenta);

  //creando cuentas
  router.post("/crear-cuenta", crearCuenta);

  //ruta para confirmar cuenta
  router.get("/confirmar/:correo", confirmarCuenta);

  //area iniciar sesion

  //pagina de sesion
  router.get("/iniciar-sesion", yaIniciasteSesion, formIniciarSesion);

  //solicitud de inicio de sesion
  router.post("/iniciar-sesion", yaIniciasteSesion, autenticarUsuario);

  //cerrando sesion
  router.get("/cerrar-sesion", usuarioAutenticado, cerrarSesion);

  //restablecer contraseña

  //direccion a la vista
  router.get("/reestablecer", yaIniciasteSesion, formRestablecerContraseña);

  //enviaremos los datos para verificar que el usuario exista y vamos a generar un token para el
  router.post("/reestablecer", yaIniciasteSesion, enviarToken);

  //ruta para resetear password
  router.get("/reestablecer/:token", yaIniciasteSesion, validarToken);

  //ruta para actualizar el password
  router.post("/reestablecer/:token", yaIniciasteSesion, actualizarPassword);

  //retornamos router.
  return router;
};
