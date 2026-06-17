// src/pages/CartPage.tsx
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <button
          onClick={() => navigate('/catalog')}
          style={{
            padding: '10px 24px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Корзина</h1>

      <div style={{ marginBottom: '20px' }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{item.name}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {item.price.toFixed(2)} ₽ / {item.unit}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 16px' }}>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                −
              </button>
              <span style={{ minWidth: '24px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                +
              </button>
            </div>

            <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: 'bold', margin: '0 16px' }}>
              {(item.price * item.quantity).toFixed(2)} ₽
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderTop: '2px solid #e5e7eb',
        marginBottom: '20px',
      }}>
        <div>
          <button
            onClick={clearCart}
            style={{
              padding: '8px 16px',
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Очистить корзину
          </button>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Итого: {totalAmount().toFixed(2)} ₽
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        style={{
          width: '100%',
          padding: '14px',
          background: '#16a34a',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        Оформить заказ
      </button>
    </div>
  );
}

export default CartPage;