import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
  btnEliminar.addEventListener("click", e => {
    //el data-proyecto-url, se obtiene metiante el dataset, y se escribe como proyectoUrl, para referirnos a el
    const urlProyecto = e.target.dataset.proyectoUrl;
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
        //obtenemos la url donde se hara la peticion
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        axios
          .delete(url, { params: { urlProyecto } })
          .then(function(respuesta) {
            console.log(respuesta);
            Swal.fire({
              title: "Listo!",
              text: "El Proyecto ha sido eliminado.",
              type: "success"
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "OOPS",
              text: respuesta.data
            });
          });
      }
    });
  });
}

export default btnEliminar;
