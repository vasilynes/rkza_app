import { useState } from 'react';
import { useInstall } from '../hooks/useInstall';

export function InstallBanner() {
  const { isInstallable, isInstalled, install } = useInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px', 
      left: '12px',
      right: '12px',
      background: '#1e40af',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      zIndex: 999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          📱 Установить приложение
        </div>
        <div style={{ fontSize: '13px', opacity: 0.9 }}>
          Быстрый доступ к каталогу и заказам
        </div>
      </div>
      
      <button
        onClick={install}
        style={{
          padding: '8px 16px',
          background: '#fff',
          color: '#1e40af',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Установить
      </button>
      
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px',
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}