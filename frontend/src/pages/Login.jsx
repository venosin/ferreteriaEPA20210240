// Página de inicio de sesión
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    // Validación de correo electrónico
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Validación de contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    }
    
    return errors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formulario
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(formData);
      
      // Guardar información del usuario
      authService.setUserInfo({
        token: response.token,
        userType: response.message.split(' ')[0], // Extrae "admin", "Employee" o "client" del mensaje
      });
      
      // Redirigir a la página principal
      navigate('/');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      
      if (err.response) {
        // Errores de respuesta del servidor
        if (err.response.status === 404) {
          setError('Usuario no encontrado');
        } else if (err.response.status === 401) {
          setError('Contraseña incorrecta');
        } else {
          setError('Error al iniciar sesión: ' + (err.response.data?.message || 'Error desconocido'));
        }
      } else if (err.request) {
        // No se recibió respuesta del servidor
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Otros errores
        setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa' }}>
      <div style={{ width: '400px', maxWidth: '90%', padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>Iniciar Sesión</h2>
        <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '20px' }}>Sistema de Gestión Ferretería EPA</p>
        
        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                borderRadius: '4px',
                border: validationErrors.email ? '1px solid #dc3545' : '1px solid #ced4da',
                fontSize: '16px'
              }}
              required
            />
            {validationErrors.email && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{validationErrors.email}</div>
            )}
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                borderRadius: '4px',
                border: validationErrors.password ? '1px solid #dc3545' : '1px solid #ced4da',
                fontSize: '16px'
              }}
              required
            />
            {validationErrors.password && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{validationErrors.password}</div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '12px', 
              background: '#0d6efd', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
            <p style={{ margin: '0' }}>Para pruebas: <strong>admin@epa.com</strong></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
