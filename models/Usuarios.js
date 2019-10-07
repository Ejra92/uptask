const sequalize = require("sequelize");
const db = require("../config/db");
const Proyectos = require("./Proyectos");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: sequalize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: sequalize.STRING(60),
      allowNull: false, //con esto digo que no pueden enviar este campo vacio
      validate: {
        isEmail: {
          //con esto validamos q en efecto sea un email
          msg: "Agrega un correo valido"
        },
        notEmpty: {
          msg: "el email no puede ir vacio"
        }
      },
      unique: {
        //con esto validamos que el correo no este repetido
        args: true,
        msg: "Usuario ya registrado"
      }
    },
    password: {
      //las constraseñas se hashean por cuestion de seguridad
      type: sequalize.STRING(60),
      allowNull: false, //con esto digo que no pueden enviar este campo vacio
      validate: {
        notEmpty: {
          msg: "el password no puede ir vacio"
        }
      }
    },
    activo: {
      type: sequalize.INTEGER,
      defaultValue: 0
    },
    token: sequalize.STRING,
    expiracion: sequalize.DATE
  },
  {
    //este hook o enganche lo que indica es que al crear un nuevo documento, se le enganchara lo siguiente
    //y es que al usuario, despues de haber sido creado se le añadira algo
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10)
        );
      }
    }
  }
);

//crearemos un metodo donde que nos permitira descifrar el password luego de ser hasheado para efectos de
//autenticacion
Usuarios.prototype.verificarPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//con esto decimos que un usuario va a tener multiple proyectos, por tal, dentro de usuario el tendra los proyectos
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
