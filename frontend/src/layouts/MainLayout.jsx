// Componente principal de layout que contiene la navegación y el contenido principal
import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import authService from '../services/authService';

function MainLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  
  // Cargar la información del usuario al montar el componente
  useEffect(() => {
    const user = authService.getUserInfo();
    setUserInfo(user);
  }, []);
  
  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearUserInfo();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Si hay un error en el logout, de todas formas limpiamos el localStorage y redirigimos
      authService.clearUserInfo();
      navigate('/login');
    }
  };
  
  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Ferretería EPA</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employees">Empleados</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clients">Clientes</Link>
              </li>
            </ul>
            
            {/* Información del usuario y botón de cierre de sesión */}
            {userInfo && (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  {userInfo.userType}
                </span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mt-4">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 mt-5">
        <div className="container">
          <p className="mb-0">© 2025 Ferretería EPA - Todos los derechos reservados</p>
        </div>
      </footer>

      {/* Script para Bootstrap */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}

export default MainLayout;
