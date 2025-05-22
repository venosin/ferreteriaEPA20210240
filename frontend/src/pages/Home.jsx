// Página de inicio
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4 mb-4">Bienvenido al Sistema de Gestión de Ferretería EPA</h1>
      
      <p className="lead mb-4">
        Este sistema te permite gestionar productos, empleados y clientes de forma sencilla.
      </p>
      
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Gestión de Productos</h5>
              <p className="card-text">
                Administra el inventario de productos: añadir, editar, eliminar y consultar.
              </p>
              <Link to="/products" className="btn btn-primary">
                Ir a Productos
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Gestión de Empleados</h5>
              <p className="card-text">
                Administra la información de empleados: registrar, actualizar y consultar.
              </p>
              <Link to="/employees" className="btn btn-primary">
                Ir a Empleados
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Gestión de Clientes</h5>
              <p className="card-text">
                Administra la información de clientes: registrar, actualizar y consultar.
              </p>
              <Link to="/clients" className="btn btn-primary">
                Ir a Clientes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
