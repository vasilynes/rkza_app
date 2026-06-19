import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOrderHistory } from '../api/orders';
import type { OrderHistory } from '../api/orders';
import { useCartStore } from '../stores/cartStore';

const PAYMENT_NAMES: Record<string, string> = {
  cash: 'Наличные',
  cashless: 'Безналичные',
  acquiring: 'Эквайринг',
  spb: 'СБП',
  invoice: 'По счёту',
};

function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const repeatOrder = useCartStore((state) => state.repeatOrder);

  const newOrderId = searchParams.get('new');  // ID только что созданного заказа

  useEffect(() => {
    getOrderHistory()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRepeat = (order: OrderHistory) => {
    repeatOrder(
      order.items.map((item) => ({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
      }))
    );
    navigate('/cart');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>История заказов</h1>

      {/* Уведомление о новом заказе */}
      {newOrderId && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '8px',
          color: '#166534',
        }}>
          ✅ Заказ №{newOrderId} успешно создан!
        </div>
      )}

      {orders.length === 0 ? (
        <p>У вас пока нет заказов</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: `2px solid ${order.id.toString() === newOrderId ? '#86efac' : '#e5e7eb'}`,
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              {/* Заголовок заказа */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <div>
                  <strong>Заказ №{order.id}</strong>
                  <span style={{ color: '#6b7280', marginLeft: '12px' }}>
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: order.status === 'Выполнен' ? '#dcfce7' : '#fef9c3',
                  color: order.status === 'Выполнен' ? '#166534' : '#854d0e',
                  fontSize: '14px',
                }}>
                  {order.status}
                </span>
              </div>

              {/* Список товаров */}
              <div style={{ marginBottom: '12px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ padding: '2px 0', color: '#4b5563', fontSize: '14px' }}>
                    {item.name} × {item.quantity} {item.unit}
                  </div>
                ))}
              </div>

              {/* Детали */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                <div>📍 {order.address}</div>
                <div>💳 {PAYMENT_NAMES[order.payment_method] || order.payment_method}</div>
              </div>

              {/* Итого и кнопки */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {order.total.toFixed(2)} ₽
                </div>
                <button
                  onClick={() => handleRepeat(order)}
                  style={{
                    padding: '8px 20px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  🔄 Повторить заказ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;