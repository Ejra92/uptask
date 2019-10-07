import Swal from "sweetalert2";
//creamos una funcion que detectara cuantas lista con el class tarea hay
//luego detectara cuales tiene los favicon i.completo ya listo, para despues
//hacer una regla de 3, y acceder mediante un id a un elemento al cual
//se le modificara su width para simular las veces de una barra de avance
export const actualizarAvance = () => {
  const tareas = document.querySelectorAll("li.tarea");
  if (tareas.length) {
    //obtenemos tareas completadas
    const tareasCompledas = document.querySelectorAll("i.completo");
    //sacamos cuanto porcentaje representan en avance
    const avance = Math.round((tareasCompledas.length * 100) / tareas.length);
    //mostrar el avance
    const porcentaje = document.querySelector("#porcentaje");
    porcentaje.style.width = avance + "%";
    if (avance === 100) {
      Swal.fire("Listo", "Proyecto Finalizado", "success");
    }
  }
};
