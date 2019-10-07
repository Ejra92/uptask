//traemos express, no reconoce import
//pero si require, y se guarda en constante
const express = require("express");

//para exportar algo usamos el mismo metodo de require
const routes = require("./routes");

//traemos path que nos permite conectar con los distintos elementos de nuestra carpeta
//existe de forma nativa en express
const path = require("path");

//traemos body parser
const bodyParser = require("body-parser");

// traemos el expressValidator
const expressValidator = require("express-validator");
//connect flash para manejar los mensajes de error
const flash = require("connect-flash");
//cookie-parser
const cookieParser = require("cookie-parser");
//express-session para mantener la sesion abierta
const session = require("express-session");

//traemos nuestro helpers
const helpers = require("./helpers");

//nos traemos el metodo de autenticacion o el modulo para esto que es passport
const passport = require("./config/passport");

//TRAEMOS LAS VARIABLES DE ENTORNO AQUI
require("dotenv").config({ path: "variables.env" });

//creamos la conexion a la DB
const db = require("./config/db");
//sequelize esta construido con promesas asi que esto retorna una promesa
//authenticate solo lo usamos para verificar la conexion, usaremos es sync
require("./models/Proyectos"); //importamos el modelo para que sync no mande error
require("./models/Tareas");
require("./models/Usuarios");

db.sync() //con esto creamos la tabla en el heidi sql
  .then(() => console.log("conectado a la base de datos"))
  .catch(error => console.log(error));

//creo una app de express llamando a la funcion
const app = express();

//le diremos de donde agarrara los archivos estaticos (css e imagenes) que por convencion la carpeta se llama public
app.use(express.static("public")); //con esto decimos que app usara, para sus archivos estaticos la direccion de public

//habilitamos nuestro template engine (pug en este caso)
app.set("view engine", "pug");

//HABILITAMOS BODY PARSER PARA LEER DATOS DEL FORMULARIO, ya que el console.log se ve es en la terminal
//va antes que las rutas
app.use(bodyParser.urlencoded({ extended: true }));

//agregamos express validator a toda la aplicacion
app.use(expressValidator());

//añadimos la carpeta vistas
//.join(entrar)(__dirname (de la carpeta donde estamos), "./hacia donde queremos ir")
app.set("views", path.join(__dirname, "./views"));

//agregamos flash messages
app.use(flash());

//agregamos cookieParser
app.use(cookieParser());

//agregamos las sesiones, nos permite navegar entre paginas sin pedir nuevamente autenticar
app.use(
  session({
    secret: "jerry",
    //con estos 2 parametros decimos si queremos que la persona a pesar de no estar haciendo nada mantenga la sesion abierta
    resave: false,
    saveUninitialized: false
  })
);

//hacemos el middleware de passport justo despues de session porque este es el que dara la auntenticacion para acceder
app.use(passport.initialize());
app.use(passport.session()); //ya con esto decimos que puede arrancar la sesion una vez se inicialice el passport

//pasamos el helper.vardump a la aplicacion
//el tercer parametro (next) es para el middleware
app.use((req, res, next) => {
  //con res.locals podemos hacer que algo se consuma en cualquier archivo del proyecto
  res.locals.vardump = helpers.vardump;
  //aqui vamos a introducir el connect-flash para mostrar las alertas
  res.locals.mensajes = req.flash();
  //dejaremos disponible que user esta haciendo la peticion para que de esta forma se envie sus datos guardados
  res.locals.usuario = { ...req.user } || null;
  next();
});

//asi conecto las rutas creadas con el index
app.use("/", routes());

//le digo en que puerto estara

//servidor y puerto
//con esto decimos elige este primero, sino elige el que te asignen
const host = process.env.HOST || "0.0.0.0";
//en este es al reves, primero asignamos la q nos de el servidor externo, sino agarra el que pongamos
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log("el servidor esta funcionando de manera adecuada");
});

//en el use podemos mandar distintas cosas, con json
//podemos mandar objetos a consumir (API)
//Esto es un ejemplo
// (const productos = [
//   {
//     pais: "singapur",
//     riqueza: "mucha"
//   },
//   {
//     pais: "taiwan",
//     riqueza: "media alta"
//   }
// ];

// //o mandarlo dentro de una variable

// const hi = "Hola Mondo";
// )
//ruta de home, colocamos algo para que aparezca
//en la ruta home (/) mandaremos una respuesta
//(res.send) que sera hola mundo
