// import { useQuery } from "react-query";
// import { getVoluntarios } from "../../services/Voluntarios";

// const ListaVoluntarios = () => {

//     const { data, isLoading, isError } = useQuery('voluntarios', getVoluntarios,{ enabled: true });


//     if(isLoading)
//         return <div className="loading">Loading...</div>

//     if(isError)
//         return <div className="error">Error</div>

//     return (
//         <>
            

//             <h1 className="Namelist">Lista Voluntarios</h1>

//             <div className="Div-Table">
//             <table border="1" className="tableVoluntarios" style={{ width: '50%', textAlign: 'center' }}>
//                 <tbody>
//                     <tr>
//                     <td>ID Voluntario</td>
//                     <td>Nombre</td>
//                     <td>Primer Apellido</td>
//                     <td>Segundo Apellido</td>
//                     <td>Carrera</td>
//                     <td>Numero</td>
//                     <td>Estado</td>
//                     </tr>
//                 {
//                     data.map((voluntarios)=>(
//                         <tr key={voluntarios.id}>
//                         <td>{voluntarios.id}</td>
//                         <td>{voluntarios.nombre}</td>
//                         <td>{voluntarios.apellido1}</td>
//                         <td>{voluntarios.apellido2}</td>
//                         <td>{voluntarios.carrera}</td>
//                         <td>{voluntarios.numero}</td>
//                         <td>{voluntarios.status}</td>
//                         </tr>
//                     ))
//                 }
//                 </tbody>
//             </table>

//             </div>
//         </>
//     )
// }

// export default ListaVoluntarios