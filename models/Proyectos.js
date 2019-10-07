//aqui configuramos el lugar donde se guardara la info, el modelo de donde y como sera la base de datos
//importamos sequelize
const Sequelize = require("sequelize");
//importamos la configuracion de la base de datos con el sequelize
const db = require("../config/db");

//importamos slug, esta dependencia o paquete permite hacer que el nombre del proyecto, genere una
//url de manera automatica con su nombre
const slug = require("slug");

const shortid = require("shortid");

//este es el modelo, y los key : value es como estara estructurado los datos..
const Proyectos = db.define(
  "proyectos",
  {
    id: {
      type: Sequelize.INTEGER, //de tipo entero
      primaryKey: true, //digo que este es el valor primario
      autoIncrement: true //de manera que cada nuevo ingreso al orm sumara 1
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
  },
  {
    //aqui van los hooks, o estos son los hooks en node
    //se usan despues de crear el modelo y responden a la situacion de antes de crear
    hooks: {
      beforeCreate(proyecto) {
        //proyecto.nombre para que mapee y busque el nombre que va a usar para generar el url
        const url = slug(proyecto.nombre).toLocaleLowerCase();

        proyecto.url = `${url}-${shortid.generate()}`;
      }
    }
  }
);

//de esta forma dejaremos disponibles los modelos para que los controladores los puedan llamar
module.exports = Proyectos;
