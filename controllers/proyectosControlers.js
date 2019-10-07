//aqui tenemos los controladores, que son
//por asi decirlo los call to action, o las acciones
//que llaman al modelo, y luego se renderizan en vista

//module.exports == export default
//exports.name == export name

//traemos el modelo para que se llame a traves de este controlador

const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (req, res) => {
  //haremos la peticion con async await a la base de datos para imprimir la datos en el db

  //agregaremos ahora el usuarioId de manera que el filtro solo busque aquellos proyectos que pertenezcan a el
  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  res.render("index", {
    nombreProyecto: "Administrador de Proyectos",
    proyectos
    //lo introducimos aqui para pasarlo como si fuera un prop a la vista de index
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos
  });
};

exports.nuevoProyecto = async (req, res) => {
  //haremos destructuring del req.body para obtener el nombre y trabajar en funcion de el
  const { nombre } = req.body;
  const proyectos = await Proyectos.findAll();

  //creamos una variable
  let errores = [];

  //establecemos condiciones en caso de que se envie algo y no se tenga nada
  if (nombre === "") {
    errores.push({ texto: "Agrega un nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos
    });
  } else {
    //enviar la info a la base de datos
    //aqui aplicamos el slug dentro de una variable para luego introducirlo en la parte de Proyectos.create
    //quitamos el metodo con slug xq cuando se repita una url necesitamos hacer algo antes de crear, con hooks

    //aqui introducimos el valor que estamos pasando mediante los locals del proyecto

    const usuarioId = res.locals.usuario.id;

    await Proyectos.create({
      nombre,
      usuarioId
    });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;

  const proyectosPromise = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });

  const proyectoPromise = await Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise
  ]);
  //una vez tenemos el proyecto, pasaremos a la vista los datos que se pasan a esta ruta
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id
    } //el orm sequelize permite incluir en una consulta un modelo completo ejemplo:
    // include: [
    //   {
    //     model: Proyectos
    //   }
    // ]
  });

  if (!proyecto) return next();

  res.render("tareas", {
    nombrePagina: "Tareas de este Proyecto",
    proyecto: proyecto.dataValues,
    proyectos,
    tareas
  });
};

exports.formularioEditar = async (req, res, next) => {
  //no se recomienda tener 2 awaits en caso como estos xq una puede afectar el rendimiendo de la otra
  const usuarioId = res.locals.usuario.id;

  const proyectosPromise = Proyectos.findAll({
    where: {
      usuarioId
    }
  });

  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    }
  });

  //por ello usaremos promesas para traerlos

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise
  ]);

  if (!proyecto) return next();
  console.log(proyecto.dataValues);
  res.render("nuevoProyecto", {
    nombrePagina: "Editando Proyecto",
    proyecto,
    proyectos
  });
};

exports.editarProyecto = async (req, res, next) => {
  //haremos destructuring del req.body para obtener el nombre y trabajar en funcion de el
  const { nombre } = req.body;
  const usuarioId = res.locals.usuario.id;

  const proyectos = await Proyectos.findAll({
    where: {
      usuarioId
    }
  });

  //creamos una variable
  let errores = [];

  //establecemos condiciones en caso de que se envie algo y no se tenga nada
  if (nombre === "") {
    errores.push({ texto: "Agrega un nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Editar Proyecto",
      errores,
      proyectos
    });
  } else {
    //con update actualizamos o editamos algun valor en nuestra base de datos
    await Proyectos.update(
      {
        nombre: nombre
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.redirect("/");
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  //en req tengo los datos que obtengo de la vista, y aqui veo como los uso
  //en params son parametros que obtengo del route, mientras que query me dara los datos propios
  //del selector o que vienen de la peticion

  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({
    where: {
      url: urlProyecto
    }
  });

  if (!resultado) return next();

  res.status(200).send("Proyecto Eliminado Correctamente");
  //en caso de que exista un problema con el servidor establecemos una condicion para evitar malas respuesta
  // if (!resultado) {
  //   return next();
  // }
};
