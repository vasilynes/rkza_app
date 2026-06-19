import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { getAddresses, getPaymentMethods, createOrder } from '../api/orders';
import type { Address, PaymentMethod } from '../api/orders';

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загружаем адреса и способы оплаты
  useEffect(() => {
    getAddresses().then(setAddresses).catch(console.error);
    getPaymentMethods().then(setPayments).catch(console.error);
  }, []);

  // Если корзина пуста — обратно в каталог
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Корзина пуста</h2>
        <button onClick={() => navigate('/catalog')}>Перейти в каталог</button>
      </div>
    );
  }

  const handleSubmit = async () => {
    // Проверка
    if (!selectedAddress) {
      setError('Выберите адрес доставки');
      return;
    }
    if (!selectedPayment) {
      setError('Выберите способ оплаты');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        address_id: selectedAddress,
        payment_method: selectedPayment,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderData);
      console.log('Заказ создан:', result);
      clearCart();
      navigate(`/orders?new=${result.order_id}`);
    } catch (err) {
      setError('Ошибка при создании заказа');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Оформление заказа</h1>

      {/* Товары в заказе */}
      <div style={{ marginBottom: '24px' }}>
        <h3>Ваш заказ:</h3>
        {items.map((item) => (
          <div key={item.productId} style={{ padding: '4px 0', color: '#4b5563' }}>
            {item.name} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} ₽
          </div>
        ))}
        <div style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '18px' }}>
          Итого: {totalAmount().toFixed(2)} ₽
        </div>
      </div>

      {/* Выбор адреса */}
      <div style={{ marginBottom: '24px' }}>
        <h3>Адрес доставки:</h3>
        {addresses.map((addr) => (
          <label
            key={addr.id}
            style={{
              display: 'block',
              padding: '12px',
              marginBottom: '8px',
              border: `2px solid ${selectedAddress === addr.id ? '#2563eb' : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="address"
              value={addr.id}
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
              style={{ marginRight: '8px' }}
            />
            {addr.address}
            {addr.is_default && <span style={{ color: '#6b7280', marginLeft: '8px' }}>(основной)</span>}
          </label>
        ))}
      </div>

      {/* Выбор оплаты */}
      <div style={{ marginBottom: '24px' }}>
        <h3>Способ оплаты:</h3>
        {payments.map((pm) => (
          <label
            key={pm.slug}
            style={{
              display: 'block',
              padding: '12px',
              marginBottom: '8px',
              border: `2px solid ${selectedPayment === pm.slug ? '#2563eb' : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="payment"
              value={pm.slug}
              checked={selectedPayment === pm.slug}
              onChange={() => setSelectedPayment(pm.slug)}
              style={{ marginRight: '8px' }}
            />
            <strong>{pm.name}</strong>
            <span style={{ color: '#6b7280', marginLeft: '8px' }}>— {pm.description}</span>
          </label>
        ))}
      </div>

      {/* Ошибка */}
      {error && (
        <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
      )}

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/cart')}
          style={{
            padding: '12px 24px',
            background: '#e5e7eb',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ← Назад в корзину
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: loading ? '#9ca3af' : '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Создаём заказ...' : 'Подтвердить заказ'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;