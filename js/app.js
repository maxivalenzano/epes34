
const formulario = document.querySelector('#formulario');

formulario.addEventListener('submit', (e) => {
     e.preventDefault();
     borrarTabla()
     const dniSeleccionado = document.querySelector('#dni').value;
     const modalidadSelect = document.querySelector('#modalidad');
     const modalidadSeleccionada = modalidadSelect.options[modalidadSelect.selectedIndex].value;

     // comprobar que ambos campos tengan algo seleccionado
     if(dniSeleccionado === 'Ingrese su DNI' || modalidadSeleccionada === '') {
          mostrarMensaje('Ambos Campos son Obligatorios', 'alert bg-danger text-center');
          } else {
          obtenerDatos(dniSeleccionado, modalidadSeleccionada)
     }
})

function obtenerDatos(dni, modalidad) {
     let link
     if (modalidad === "COS")
          link ='https://sheets.googleapis.com/v4/spreadsheets/1dlk9o5cVNu0Ntt66YyqRuZJRegHa0GoBLRgRarXCABo/values/Boletin COS!A:N?key=AIzaSyAO6aVJa6cXbdlGf-RDb3m1Cl29txP4XqU'
     else
          link ='https://sheets.googleapis.com/v4/spreadsheets/1dlk9o5cVNu0Ntt66YyqRuZJRegHa0GoBLRgRarXCABo/values/boletin!A:P?key=AIzaSyAO6aVJa6cXbdlGf-RDb3m1Cl29txP4XqU'
     mostrarOcultarSpinner('block');
     fetch(link)
        .then(res => {return res.json()} )
        .then(alumnos => {
               //console.log(base);
               var boolAlumno = true;
               let base;
               alumnos.values.forEach(alumno => {
               if (alumno[0] === dni) {
                    switch (alumno[2]){
                        case '5':
                            base = alumnos.values[1]
                            break;
                        case '6':
                            base = alumnos.values[2]
                            break;
                        default:
                            base = alumnos.values[0]
                    }
                    mostrarAlumno(alumno, base);
                    boolAlumno = false;  
               }
               });
               if (boolAlumno){
                    mostrarMensaje('Verifique el DNI o el ciclo ingresado', 'alert bg-warning text-center');
                    mostrarOcultarSpinner('none');
                    borrarTabla()
               }
            
        })
        .catch(error =>  {
             console.log(error);
             mostrarMensaje('No se pudo establecer la conexión', 'alert bg-danger text-center');
             mostrarOcultarSpinner('none');
             borrarTabla()
          })
}

function mostrarAlumno(datos, base) {
     borrarTabla()
     
     let html ='';
     html += `
          <div class="">
               <div class="">
                    <h2 class="card-title">${datos[1]}</h2> 
                    <label>DNI: ${datos[0]} </label><br>
                    <label>Curso: ${datos[2]} - División: ${datos[3]} </label>
                    <table class="table table-hover">
                    <thead>
                         <tr>
                              <th scope="col">Espacio Curricular</th>
                              <th scope="col">Calificación</th>
                         </tr>
                    </thead>
                    <tbody>
          `
 
     for (let i = 4; i < (base.length); i++){
         html += `
                 <tr>
                 <td>${base[i]} </td>
                 <td>${datos[i]}</td>
                 </tr>
             `;
     }
     html += `
          </tbody></table> 
          <br><br>
          <table class="table table-hover">
               <thead>
                    <tr>
                    <th colspan="2">Referencia de las Calificaciones</th>
                    </tr>
               </thead>
               <tbody>
                    <tr>
                         <td>PC</td>
                         <td>Presentación Completa de los trabajos</td>
                    </tr>
                    <tr>
                         <td>PP</td>
                         <td>Presentacion Parcial de los trabajos</td>
                    </tr>
                    <tr>
                         <td>NoP</td>
                         <td>No Presenta los trabajos</td>
                    </tr>
                    <tr>
                         <td>Ap. Res</td>
                         <td>Aprobado por Resolución 1991</td>
                    </tr>
               </tbody>
               </table>
          </div>
          </div>
     `

     setTimeout(() => {
            // hay un retraso aproposito de 1 seg para mi lindo spinner
           document.querySelector('#resultado').innerHTML = html;

           mostrarOcultarSpinner('none');
     }, 1000);
    }
    

function mostrarMensaje(mensaje, clases) {
     const div = document.createElement('div');
     div.className = clases;
     div.appendChild(document.createTextNode(mensaje));

     // seleccionar mensajes
     const divMensaje = document.querySelector('.mensajes');
     divMensaje.appendChild(div);

     // mostrar contenido
     setTimeout(() => {
     document.querySelector('.mensajes div').remove();
     }, 4000);
}

function mostrarOcultarSpinner(vista) {
     const spinner = document.querySelector('.contenido-spinner');
     spinner.style.display = vista;
}

function borrarTabla() {
     const resultadoAnterior = document.querySelector('#resultado > div');
     if(resultadoAnterior) {
          resultadoAnterior.remove();
     }
}
