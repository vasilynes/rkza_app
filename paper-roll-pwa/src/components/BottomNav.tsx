import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.items)
    .reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;
  const handleCall = () => {
    const phone = '+79001234567'; 

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      navigator.clipboard.writeText(phone).then(() => {
        alert(`Телефон скопирован: ${phone}`);
      }).catch(() => {
        alert(`Позвоните нам: ${phone}`);
      });
    }
  };
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      zIndex: 1000,
    }}>
      <button
        onClick={() => navigate('/catalog')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/catalog') ? '#2563eb' : '#6b7280',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>📦</span>
        Каталог
      </button>

      <button
        onClick={() => navigate('/cart')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/cart') ? '#2563eb' : '#6b7280',
          cursor: 'pointer',
          fontSize: '12px',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '20px' }}>🛒</span>
        Корзина
        {totalItems > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '8px',
            background: '#dc2626',
            color: '#fff',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {totalItems}
          </span>
        )}
      </button>

      <button
        onClick={() => navigate('/orders')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/orders') ? '#2563eb' : '#6b7280',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>📋</span>
        Заказы
      </button>

      <button
        onClick={() => navigate('/profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/profile') ? '#2563eb' : '#6b7280',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>👤</span>
        Профиль
      </button>
      <button
        onClick={handleCall}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: '#16a34a',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>📞</span>
        Звонок
      </button>
    </nav>
  );
}