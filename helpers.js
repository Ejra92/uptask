//los helpers son archivos con codigo que por lo general tienden a reutilizarse
//para dejarlo disponible en todo el proyecto lo exportamos

exports.vardump = objeto => JSON.stringify(objeto, null, 2);
