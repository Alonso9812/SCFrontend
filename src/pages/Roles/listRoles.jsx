import { useQuery } from "react-query";
import { getRoles } from "../../services/RolesServicios";

const ListaRoles = () => {

    const { data, isLoading, isError } = useQuery('roles', getRoles,{ enabled: true });


    if(isLoading)
        return <div className="loading">Loading...</div>

    if(isError)
        return <div className="error">Error</div>

    return (
        <>
            

            <h1 className="Namelist">Roles</h1>

            <div className="Div-Table">
            <table border="1" className="TableRoles" style={{ width: '50%', textAlign: 'center' }}>
                <tbody>
                    <tr>
                    <td>ID Rol</td>
                    <td>Nombre</td>
                    </tr>
                {
                    data.map((roles)=>(
                        <tr key={roles.id}>
                        <td>{roles.id}</td>
                        <td>{roles.Nombre}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

            </div>
            
        </>
    )
}

export default ListaRoles