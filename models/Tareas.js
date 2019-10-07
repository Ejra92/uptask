const Sequialize = require("sequelize");
const db = require("../config/db");
//importamos el otro model, proyectos ya que estos datos pertenecen a los proyectos que se creen
const Proyectos = require("./Proyectos");
const Tareas = db.define("tareas", {
  id: {
    type: Sequialize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tarea: Sequialize.STRING(100),
  estado: Sequialize.INTEGER(1)
});
//con esto creamos una llave foranea donde indicia que cada vez que se actualize aqui algo pertenecera a proyectos
Tareas.belongsTo(Proyectos);
//otra forma de hacerlo seria Proyectos.hasmany(Tareas) pero es para decir que un proyecto tendra varias tareas
//sirve pero no lo usaremos, ademas q deberia crearse en otra parte del modelo
module.exports = Tareas;
