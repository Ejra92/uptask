//este archivo es creado para configurar el paquete passport, que como tal ayuda a la autenticacion de alguien
//mediante mas de 500 metodos, desde github, facebook, hasta mucho mas, hasta hacerlo de manera local y personalizada

//nos traemos passport y passport-local para usar la estrategia local
const passport = require("passport");
const LocalStrategy = require("passport-local");

//debemos traer el modelo al cual se le aplicara este metodo passport
const Usuarios = require("../models/Usuarios");

passport.use(
  //creamos una nueva instancia
  new LocalStrategy(
    //por default el pide username y password, nosotros tenemos email en vez de user asi q modificamos eso
    {
      //deben ser iguales al que tengamos dentro de nuestro modelo a utilizar
      usernameField: "email",
      usernamePassword: "password"
    },
    //pasamos como parametros los datos password y email
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        });
        //en caso de existir el usuario pero que la contraseña sea mala hacemos lo siguiente
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: "La contraseña es invalida"
          });
        }
        //en caso de que todo este bien
        return done(null, usuario);
      } catch (error) {
        //el done marca como finalizado y recibe 3 parametros,
        return done(null, false, {
          message: "La cuenta no existe"
        });
      }
    }
  )
);

//luego de esto debemos serializar y deserializar el usuario, no entendi bien para que es, video 79

//serializar el usuario // esto lo pone junto como un objeto
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

//Deserializar el usuario // esto separa el objeto que queda como resultado del passport
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

//dejamos esto disponible para el proyecto

module.exports = passport;
