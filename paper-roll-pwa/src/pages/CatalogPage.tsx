import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../api/catalog';
import type { Category, Product } from '../api/catalog'; 
import { useCartStore } from '../stores/cartStore';

function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory || undefined)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleAddToCart = (product: Product) => {
    console.log('Добавляем товар:', product.name);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
    });
    console.log('Корзина после добавления:', useCartStore.getState().items);
  }

  return (
    <div>
      <h1>Каталог товаров</h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '8px 16px',
            background: activeCategory === null ? '#2563eb' : '#e5e7eb',
            color: activeCategory === null ? '#fff' : '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Все товары
        </button>
        
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            style={{
              padding: '8px 16px',
              background: activeCategory === cat.slug ? '#2563eb' : '#e5e7eb',
              color: activeCategory === cat.slug ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <h3>{product.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{product.description}</p>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {product.price.toFixed(2)} ₽ / {product.unit}
              </p>
              <p style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626', fontSize: '14px' }}>
                {product.stock > 0 ? `В наличии: ${product.stock} ${product.unit}` : 'Нет в наличии'}
              </p>
              <button
                onClick={() => handleAddToCart(product)}  // ← изменили
                disabled={product.stock === 0}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '8px',
                  background: product.stock > 0 ? '#2563eb' : '#9ca3af',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                В корзину
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;