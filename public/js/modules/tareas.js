import axios from "axios";
import Swal from "sweetalert2";
//importamos la funcion que actualiza el avance para que se ejecute
//cada vez que se complete, cree o elimine alguna tarea
import { actualizarAvance } from "../funciones/avance";

//este es el codigo que afectara el area de tareas
const tareas = document.querySelector(".listado-pendientes");
//este codigo es para cuando se toque en tarea ocurra algo
if (tareas) {
  tareas.addEventListener("click", e => {
    if (e.target.classList.contains("fa-check-circle")) {
      //con esto digo, si lo que pisas tiene esta clase, responderas onishan
      //console.log("no me toques asi onishan :$");

      //con los const reducimos lo largo del codigo, pero decimos que al target
      //subiremos 2 padres y entraremos a los datos de dataset y elegiremos tarea
      const icono = e.target.parentElement.parentElement;
      const idTarea = icono.dataset.tarea;
      const url = `${location.origin}/tareas/${idTarea}`;
      axios
        .patch(url, {
          idTarea
        })
        .then(res => {
          if (res.status === 200) {
            e.target.classList.toggle("completo");
            actualizarAvance();
          }
        })
        .catch(rej => console.log(rej));
    }
    if (e.target.classList.contains("fa-trash")) {
      const elementoHtml = e.target.parentElement.parentElement,
        idTarea = elementoHtml.dataset.tarea;
      Swal.fire({
        title: "Estas Seguro?",
        text: "No podras deshacer este cambio!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.value) {
          console.log("me mataste");
          const url = `${location.origin}/tareas/${idTarea}`;
          axios
            .delete(url, {
              params: {
                idTarea
              }
            })
            .then(function(res) {
              if (res.status === 200) {
                //con esto digo, que si la respuesta de mi peticion para eliminar es
                //satisfactoria, entonces, eliminame el nodo del template.
                //para ello subimos al elemento padre y eliminamos al hijo por su referencia
                //o posicion exacta
                elementoHtml.parentElement.removeChild(elementoHtml);
                Swal.fire("LISTO!", res.data, "success");
                actualizarAvance();
              }
            })
            .catch(rej => {
              Swal.fire("Ha ocurrido un error", "Servidor caido", "cancel");
            });
        }
      });
    }
  });
}

export default tareas;
