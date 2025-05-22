// Página para listar todos los productos y realizar operaciones CRUD
import { useState, useEffect } from 'react';
import productService from '../../services/productService';

function ProductList() {
  // Estados para manejar los productos y formularios
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario de producto
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  
  // Estado para los errores de validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para controlar si estamos editando o creando
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Función para cargar todos los productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    
    // Validación de nombre
    if (!formData.name) {
      errors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 50) {
      errors.name = 'El nombre no puede exceder los 50 caracteres';
    }
    
    // Validación de precio
    if (!formData.price) {
      errors.price = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = 'El precio debe ser un número positivo';
    }
    
    // Validación de stock
    if (!formData.stock) {
      errors.stock = 'El stock es obligatorio';
    } else if (isNaN(parseInt(formData.stock, 10)) || parseInt(formData.stock, 10) < 0) {
      errors.stock = 'El stock debe ser un número entero positivo';
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
      // Convertir valores numéricos
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      if (editMode) {
        // Actualizar producto existente
        await productService.update(currentProductId, productData);
        setEditMode(false);
        setCurrentProductId(null);
      } else {
        // Crear nuevo producto
        await productService.create(productData);
      }
      
      // Limpiar formulario y recargar productos
      setFormData({ name: '', description: '', price: '', stock: '' });
      loadProducts();
    } catch (err) {
      setError('Error al guardar el producto. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  // Preparar formulario para editar un producto
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setEditMode(true);
    setCurrentProductId(product._id);
    setValidationErrors({});
    
    // Hacer scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', stock: '' });
    setEditMode(false);
    setCurrentProductId(null);
    setError(null);
    setValidationErrors({});
  };

  // Eliminar un producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.delete(id);
        loadProducts();
      } catch (err) {
        setError('Error al eliminar el producto. Por favor, intenta de nuevo.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">{editMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      
      {/* Mostrar mensajes de error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      {/* Formulario para agregar/editar producto */}
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
            <label htmlFor="price" className="form-label">Precio *</label>
            <input
              type="number"
              className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            {validationErrors.price && (
              <div className="invalid-feedback">{validationErrors.price}</div>
            )}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="stock" className="form-label">Stock *</label>
            <input
              type="number"
              className={`form-control ${validationErrors.stock ? 'is-invalid' : ''}`}
              id="stock"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
            {validationErrors.stock && (
              <div className="invalid-feedback">{validationErrors.stock}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              maxLength="500"
            ></textarea>
            <small className="text-muted">Máximo 500 caracteres</small>
          </div>
        </div>
        
        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2">
            {editMode ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
          {editMode && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <h2 className="mb-4">Lista de Productos</h2>
      
      {/* Mostrar indicador de carga */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        /* Tabla de productos */
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No hay productos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductList;
