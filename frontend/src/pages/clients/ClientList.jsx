// Página para listar todos los clientes y realizar operaciones CRUD
import { useState, useEffect } from 'react';
import clientService from '../../services/clientService';

function ClientList() {
  // Estados para manejar los clientes y formularios
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario de cliente
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    password: '',
    telephone: '',
    dui: ''
  });
  
  // Estado para los errores de validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para controlar si estamos editando o creando
  const [editMode, setEditMode] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, []);

  // Función para cargar todos los clientes
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    // Validación de nombre
    if (!formData.name) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 50) {
      errors.name = 'El nombre no puede exceder los 50 caracteres';
    }
    
    // Validación de apellido
    if (!formData.lastName) {
      errors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    } else if (formData.lastName.length > 50) {
      errors.lastName = 'El apellido no puede exceder los 50 caracteres';
    }
    
    // Validación de correo electrónico
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (formData.email.length < 5) {
      errors.email = 'El correo electrónico debe tener al menos 5 caracteres';
    } else if (formData.email.length > 254) {
      errors.email = 'El correo electrónico no puede exceder los 254 caracteres';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    
    // Validación de teléfono (formato 0000-0000)
    if (!formData.telephone) {
      errors.telephone = 'El teléfono es obligatorio';
    } else if (!/^\d{4}-\d{4}$/.test(formData.telephone)) {
      errors.telephone = 'El formato debe ser 0000-0000';
    }
    
    // Validación de DUI
    if (!formData.dui) {
      errors.dui = 'El DUI es obligatorio';
    } else if (!/^\d{8}-\d{1}$/.test(formData.dui)) {
      errors.dui = 'El formato debe ser 12345678-9';
    }
    
    // Validación de fecha de nacimiento
    if (!formData.birthday) {
      errors.birthday = 'La fecha de nacimiento es obligatoria';
    }
    
    // Validación de contraseña
    if (!editMode && !formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (formData.password && formData.password.length > 64) {
      errors.password = 'La contraseña no puede exceder los 64 caracteres';
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
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      if (editMode) {
        // Actualizar cliente existente
        await clientService.update(currentClientId, formData);
        setEditMode(false);
        setCurrentClientId(null);
      } else {
        // Crear nuevo cliente
        await clientService.create(formData);
      }
      
      // Limpiar formulario y recargar clientes
      resetForm();
      loadClients();
    } catch (err) {
      setError('Error al guardar el cliente. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      lastName: '',
      birthday: '',
      email: '',
      password: '',
      telephone: '',
      dui: ''
    });
    setValidationErrors({});
  };

  // Preparar formulario para editar un cliente
  const handleEdit = (client) => {
    // Formatear fechas para el input date
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      name: client.name || '',
      lastName: client.lastName || '',
      birthday: formatDate(client.birthday),
      email: client.email || '',
      password: '', // No mostramos la contraseña existente
      telephone: client.telephone || '',
      dui: client.dui || ''
    });
    setValidationErrors({});
    
    setEditMode(true);
    setCurrentClientId(client._id);
    
    // Hacer scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edición
  const handleCancel = () => {
    resetForm();
    setEditMode(false);
    setCurrentClientId(null);
    setError(null);
  };

  // Eliminar un cliente
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await clientService.delete(id);
        loadClients();
      } catch (err) {
        setError('Error al eliminar el cliente. Por favor, intenta de nuevo.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">{editMode ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h2>
      
      {/* Mostrar mensajes de error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      {/* Formulario para agregar/editar cliente */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength="2"
              maxLength="50"
              required
            />
            {validationErrors.name && (
              <div className="invalid-feedback">{validationErrors.name}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="lastName" className="form-label">Apellido *</label>
            <input
              type="text"
              className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              minLength="2"
              maxLength="50"
              required
            />
            {validationErrors.lastName && (
              <div className="invalid-feedback">{validationErrors.lastName}</div>
            )}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              minLength="5"
              maxLength="254"
              required
            />
            {validationErrors.email && (
              <div className="invalid-feedback">{validationErrors.email}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="telephone" className="form-label">Teléfono * (formato: 0000-0000)</label>
            <input
              type="tel"
              className={`form-control ${validationErrors.telephone ? 'is-invalid' : ''}`}
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              pattern="\d{4}-\d{4}"
              placeholder="0000-0000"
              required
            />
            {validationErrors.telephone && (
              <div className="invalid-feedback">{validationErrors.telephone}</div>
            )}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="dui" className="form-label">DUI * (formato: 12345678-9)</label>
            <input
              type="text"
              className={`form-control ${validationErrors.dui ? 'is-invalid' : ''}`}
              id="dui"
              name="dui"
              value={formData.dui}
              onChange={handleChange}
              pattern="\d{8}-\d{1}"
              placeholder="12345678-9"
              required
            />
            {validationErrors.dui && (
              <div className="invalid-feedback">{validationErrors.dui}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="birthday" className="form-label">Fecha de Nacimiento *</label>
            <input
              type="date"
              className={`form-control ${validationErrors.birthday ? 'is-invalid' : ''}`}
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
            {validationErrors.birthday && (
              <div className="invalid-feedback">{validationErrors.birthday}</div>
            )}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">Contraseña {!editMode && '*'} (8-64 caracteres)</label>
            <input
              type="password"
              className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              maxLength="64"
              required={!editMode}
            />
            {validationErrors.password && (
              <div className="invalid-feedback">{validationErrors.password}</div>
            )}
            {editMode && (
              <small className="form-text text-muted">
                Deja en blanco para mantener la contraseña actual.
              </small>
            )}
          </div>
          
          {/* Se eliminó el campo de verificado ya que se gestiona automáticamente por el sistema */}
        </div>
        
        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2">
            {editMode ? 'Actualizar Cliente' : 'Agregar Cliente'}
          </button>
          {editMode && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <h2 className="mb-4">Lista de Clientes</h2>
      
      {/* Mostrar indicador de carga */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        /* Tabla de clientes */
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>DUI</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.lastName}</td>
                    <td>{client.email}</td>
                    <td>{client.telephone}</td>
                    <td>{client.dui}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(client)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No hay clientes disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientList;
