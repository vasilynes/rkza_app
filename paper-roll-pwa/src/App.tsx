import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';  // ← добавили
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cart"  // ← добавили
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;