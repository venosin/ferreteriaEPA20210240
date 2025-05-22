import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/products/ProductList';
import EmployeeList from './pages/employees/EmployeeList';
import ClientList from './pages/clients/ClientList';
import Login from './pages/Login';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para el login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="clients" element={<ClientList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
