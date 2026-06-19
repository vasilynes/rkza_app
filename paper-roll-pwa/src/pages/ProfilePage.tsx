import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Профиль</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Компания:</strong> ООО Рога и Копыта</p>
        <p><strong>ИНН:</strong> 7707083893</p>
      </div>
      <button
        onClick={() => navigate('/addresses')}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginRight: '12px',
          marginBottom: '12px',
        }}
      >
        Мои адреса
      </button>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 24px',
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Выйти
      </button>
    </div>
  );
}

export default ProfilePage;