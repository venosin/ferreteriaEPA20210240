// Componente para proteger rutas que requieren autenticación
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute() {
  const isAuthenticated = authService.isAuthenticated();
  
  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido de la ruta
  return <Outlet />;
}

export default ProtectedRoute;
