import { useEffect, useState } from 'react';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../api/orders';
import type { Address } from '../api/orders';

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newAddress, setNewAddress] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  
  const [error, setError] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newAddress.trim()) {
      setError('Введите адрес');
      return;
    }
    
    try {
      const created = await createAddress(newAddress, newIsDefault);
      setAddresses(prev => [...prev, created]);
      setNewAddress('');
      setNewIsDefault(false);
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await updateAddress(id, { is_default: true });
      setAddresses(prev =>
        prev.map(a => ({ ...a, is_default: a.id === id }))
      );
    } catch (err) {
      setError('Ошибка при изменении');
    }
  };

  const handleStartEdit = (addr: Address) => {
    setEditingId(addr.id);
    setEditText(addr.address);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editText.trim()) return;
    
    try {
      const updated = await updateAddress(id, { address: editText });
      setAddresses(prev =>
        prev.map(a => (a.id === id ? updated : a))
      );
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id: number) => {
    if (addresses.length <= 1) {
      setError('Нельзя удалить последний адрес');
      return;
    }
    
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при удалении');
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>Мои адреса</h1>

      {error && (
        <p style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {addresses.map((addr) => (
          <div
            key={addr.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              border: `2px solid ${addr.is_default ? '#2563eb' : '#e5e7eb'}`,
              borderRadius: '8px',
            }}
          >
            {/* Текст адреса */}
            <div style={{ flex: 1, marginRight: '12px' }}>
              {editingId === addr.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                  }}
                  autoFocus
                />
              ) : (
                <span>
                  {addr.address}
                  {addr.is_default && (
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}>
                      Основной
                    </span>
                  )}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {editingId === addr.id ? (
                <>
                  <button onClick={() => handleSaveEdit(addr.id)} style={btnStyle('#16a34a')}>✓</button>
                  <button onClick={() => setEditingId(null)} style={btnStyle('#6b7280')}>✕</button>
                </>
              ) : (
                <>
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      style={btnStyle('#2563eb')}
                      title="Сделать основным"
                    >
                      ⭐
                    </button>
                  )}
                  <button onClick={() => handleStartEdit(addr)} style={btnStyle('#f59e0b')}>✎</button>
                  <button onClick={() => handleDelete(addr.id)} style={btnStyle('#dc2626')}>🗑</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div style={{
          padding: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3 style={{ marginTop: 0 }}>Новый адрес</h3>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Введите адрес доставки"
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              type="checkbox"
              checked={newIsDefault}
              onChange={(e) => setNewIsDefault(e.target.checked)}
            />
            Сделать основным
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleAdd} style={btnStyle('#16a34a', true)}>
              Добавить
            </button>
            <button onClick={() => setShowAddForm(false)} style={btnStyle('#6b7280', true)}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          + Добавить адрес
        </button>
      )}
    </div>
  );
}

// Вспомогательная функция для стилей кнопок
function btnStyle(color: string, full: boolean = false): React.CSSProperties {
  return {
    width: full ? undefined : '32px',
    height: '32px',
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: full ? 1 : undefined,
    padding: full ? '8px 16px' : undefined,
  };
}

export default AddressesPage;