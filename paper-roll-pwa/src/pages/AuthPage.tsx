import { useState } from 'react';
import { isValidINN } from '../utils/validators';
import { loginByInn } from '../api/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AuthPage() {
    const [inn, setInn] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
      return <Navigate to='/catalog' replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!inn.trim()) {
        setError('Введите ИНН');
        return
      }

      if (!isValidINN(inn)) {
        setError('Неверный ИНН. Проверьте правильность ввода');
        return;
      }

      setLoading(true);
      try {
        const data = await loginByInn(inn)
        console.log('Успешный вход:', data);
        localStorage.setItem('auth_token', data.token)
        navigate('/catalog');
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Клиент с таким ИНН не найден');
        } else {
          setError('Ошибка сервера. Попробуйте позже')
        }
      } finally {
        setLoading(false)
      }
    };

    return (
      <div>
        <h1>Вход в каталог</h1>
        <p>Введите ИНН вашей компании для регистрации</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inn}
            onChange={(e) => setInn(e.target.value)}
            placeholder="Например: 7707083893"
            maxLength={12}
            disabled={loading}
          />
          <button type="submit">
            {loading? 'Проверяем...' : 'Продолжить'}
          </button>
        </form>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
}

export default AuthPage;


