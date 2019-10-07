//vamos a requerir el modelo relacionado a este controler, asi que lo requerimos

const Tareas = require("../models/Tareas");
const Proyectos = require("../models/Proyectos");

exports.crearTarea = async (req, res, next) => {
  //mantengo los proyectos que se ven en la parte izquierda
  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  //le digo la direccion a la cual se van a agregar los datos
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
  //con esto lei el valor de la tarea
  const { tarea } = req.body;

  if (!tarea || tarea === "") return res.status(400).redirect("/");

  // creamos el estado en 0 porque el valor de este es falso, o sea aun no se completa
  let estado = 0;
  //obtenemos el id del proyecto que se pide por default en el modelo de tareas
  const proyectoId = proyecto.id;

  //teniendo los datos solo toca crear o hacer el ORM en el model de tarea

  const resultado = await Tareas.create({
    tarea,
    estado,
    proyectoId
  });

  if (!resultado) return next();

  res.redirect(`/proyectos/${proyecto.url}`);

  //   if (!tarea || tarea === "") {
  //     res.render("tareas", {
  //       error: true,
  //       proyectos
  //     });
  //   }

  //res.send("lo logramos camarada");
};

exports.cambiarEstadoTarea = async (req, res, next) => {
  //cuando enviamos datos mediante le metodo HTTP patch, se accede a los datos.
  //mediante req.params, ya que mediante req.query no se puede
  const { id } = req.params;
  const tarea = await Tareas.findOne({ where: { id } });
  let estado = 0;
  if (tarea.estado === estado) {
    estado = 1;
  }
  tarea.estado = estado;
  const resultado = await tarea.save();
  if (!resultado) return next();
  res.status(200).send("actualizado");
};

exports.eliminarTarea = async (req, res, next) => {
  const { id } = req.params;
  const resultado = await Tareas.destroy({
    where: {
      id
    }
  });
  //esto es por si hay un error en el servidor se salte esta parte del codigo
  if (!resultado) return next();
  res.status(200).send("Tarea Eliminada");
};
