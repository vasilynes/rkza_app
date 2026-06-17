import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';

export function CartIcon() {
  const items = useCartStore((state) => state.items);  // ← подписываемся на items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/cart')}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      🛒
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#dc2626',
            color: '#fff',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}