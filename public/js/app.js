//scrip de proyectos
import proyectos from "./modules/proyectos";

//scripts para el area de tareas
import tareas from "./modules/tareas";

//scrip para medir el avance de nuestras tareas
import { actualizarAvance } from "./funciones/avance";

//traemos la funcion
//con esto le decimos como que se mantengan los datos a pesar de haber recargado
//la pagina, lo que dice es que al document le agregaremos un escuchador que
//al detectar que el contenido del dom ha sido cargado, enviara la funcion
//ella se actualizara en funcion de sus datos
document.addEventListener("DOMContentLoaded", () => {
  actualizarAvance();
});
