# main.py — добавляем после эндпоинта логина
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Модели ====================
class LoginRequest(BaseModel):
    inn: str

class LoginResponse(BaseModel):
    token: str
    company_name: str

class Product(BaseModel):
    id: int
    name: str
    category: str
    price: float
    unit: str       # шт, рулон, коробка
    stock: int      # остаток
    description: str

class Category(BaseModel):
    slug: str
    name: str
    icon: str


# ==================== Моковые данные ====================
MOCK_PRODUCTS = [
    # Кассовая лента
    Product(id=1, name="Кассовая лента 57x12", category="receipt", price=45.00, unit="рулон", stock=500, description="Термолента для кассовых аппаратов, 57мм x 12м"),
    Product(id=2, name="Кассовая лента 80x12", category="receipt", price=65.00, unit="рулон", stock=300, description="Термолента для кассовых аппаратов, 80мм x 12м"),
    Product(id=3, name="Кассовая лента 57x30", category="receipt", price=95.00, unit="рулон", stock=200, description="Термолента увеличенной намотки, 57мм x 30м"),
    
    # Термоэтикетки
    Product(id=4, name="Термоэтикетка 58x40", category="thermo", price=120.00, unit="рулон", stock=400, description="Термоэтикетка для весов, 58мм x 40мм"),
    Product(id=5, name="Термоэтикетка 58x60", category="thermo", price=150.00, unit="рулон", stock=350, description="Термоэтикетка для весов, 58мм x 60мм"),
    
    # Полуглянец
    Product(id=6, name="Полуглянец 100x70", category="semigloss", price=200.00, unit="лист", stock=1000, description="Бумага полуглянцевая, 100г/м², 70x100см"),
    Product(id=7, name="Полуглянец 150x100", category="semigloss", price=350.00, unit="лист", stock=800, description="Бумага полуглянцевая, 150г/м², 100x150см"),
    
    # Риббоны
    Product(id=8, name="Риббон 60x300", category="ribbon", price=180.00, unit="рулон", stock=150, description="Красящая лента для термотрансферной печати, 60мм x 300м"),
    Product(id=9, name="Риббон 110x300", category="ribbon", price=320.00, unit="рулон", stock=120, description="Красящая лента для термотрансферной печати, 110мм x 300м"),
]

MOCK_CATEGORIES = [
    Category(slug="receipt", name="Кассовая лента", icon="🧾"),
    Category(slug="thermo", name="Термоэтикетки", icon="🏷️"),
    Category(slug="semigloss", name="Полуглянец", icon="📄"),
    Category(slug="ribbon", name="Риббоны", icon="🖨️"),
]


# ==================== Эндпоинты ====================
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    print(f"Получен ИНН: {request.inn}")
    return LoginResponse(
        token="fake_token_12345",
        company_name="ООО Рога и Копыта"
    )


@app.get("/api/categories", response_model=list[Category])
async def get_categories():
    """Возвращает список категорий товаров"""
    return MOCK_CATEGORIES


@app.get("/api/products", response_model=list[Product])
async def get_products(category: Optional[str] = None):
    """
    Возвращает товары. Если указана category — фильтрует.
    /api/products — все товары
    /api/products?category=receipt — только кассовая лента
    """
    if category:
        filtered = [p for p in MOCK_PRODUCTS if p.category == category]
        if not filtered:
            raise HTTPException(status_code=404, detail="Категория не найдена")
        return filtered
    return MOCK_PRODUCTS

class Address(BaseModel):
    id: int
    address: str
    is_default: bool

class PaymentMethod(BaseModel):
    slug: str
    name: str
    description: str

class CheckoutRequest(BaseModel):
    address_id: int
    payment_method: str
    items: list[dict]  # [{product_id, quantity}]

class CheckoutResponse(BaseModel):
    order_id: int
    message: str

# Моковые данные
MOCK_ADDRESSES = [
    Address(id=1, address="г. Красноярск, ул. ***, д. 10, офис 5", is_default=True),
    Address(id=2, address="г. Красноярск, ул. ***, д. 25, склад 3", is_default=False),
]

MOCK_PAYMENT_METHODS = [
    PaymentMethod(slug="cash", name="Наличные", description="Оплата при получении"),
    PaymentMethod(slug="cashless", name="Безналичные", description="Банковский перевод"),
    PaymentMethod(slug="acquiring", name="Эквайринг", description="Картой при получении"),
    PaymentMethod(slug="spb", name="СБП", description="Система быстрых платежей"),
    PaymentMethod(slug="invoice", name="Оплата по счёту", description="Выставим счёт на юрлицо"),
]

# Новые эндпоинты
@app.get("/api/addresses", response_model=list[Address])
async def get_addresses():
    """Возвращает адреса доставки клиента"""
    return MOCK_ADDRESSES

@app.get("/api/payment-methods", response_model=list[PaymentMethod])
async def get_payment_methods():
    """Возвращает доступные способы оплаты"""
    return MOCK_PAYMENT_METHODS

@app.post("/api/orders", response_model=CheckoutResponse)
async def create_order(request: CheckoutRequest):
    """Создаёт заказ (пока мок)"""
    print(f"Новый заказ: адрес={request.address_id}, оплата={request.payment_method}")
    print(f"Товары: {request.items}")
    return CheckoutResponse(order_id=1001, message="Заказ успешно создан")

from datetime import datetime

class OrderItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    unit: str = "шт"

class OrderHistory(BaseModel):
    id: int
    created_at: str
    items: list[OrderItem]
    total: float
    payment_method: str
    address: str
    status: str

# Моковые заказы
MOCK_ORDERS = [
    OrderHistory(
        id=1001,
        created_at="2026-06-15T14:30:00",
        items=[
            OrderItem(product_id=1, name="Кассовая лента 57x12", price=45.00, quantity=10),
            OrderItem(product_id=4, name="Термоэтикетка 58x40", price=120.00, quantity=5),
        ],
        total=1050.00,
        payment_method="invoice",
        address="г. Москва, ул. Ленина, д. 10, офис 5",
        status="Выполнен",
    ),
    OrderHistory(
        id=1002,
        created_at="2026-06-12T10:15:00",
        items=[
            OrderItem(product_id=8, name="Риббон 60x300", price=180.00, quantity=3),
        ],
        total=540.00,
        payment_method="spb",
        address="г. Москва, ул. Пушкина, д. 25, склад 3",
        status="Выполнен",
    ),
    OrderHistory(
        id=1003,
        created_at="2026-06-01T09:00:00",
        items=[
            OrderItem(product_id=2, name="Кассовая лента 80x12", price=65.00, quantity=20),
            OrderItem(product_id=6, name="Полуглянец 100x70", price=200.00, quantity=100),
            OrderItem(product_id=9, name="Риббон 110x300", price=320.00, quantity=2),
        ],
        total=21940.00,
        payment_method="cashless",
        address="г. Москва, ул. Ленина, д. 10, офис 5",
        status="Выполнен",
    ),
]

@app.get("/api/orders/history", response_model=list[OrderHistory])
async def get_order_history():
    """Возвращает историю заказов (последние сверху)"""
    return sorted(MOCK_ORDERS, key=lambda o: o.created_at, reverse=True)

class AddressCreate(BaseModel):
    address: str
    is_default: bool = False

class AddressUpdate(BaseModel):
    address: str | None = None
    is_default: bool | None = None

# Хранилище адресов в памяти (потом заменим на БД)
addresses_db: list[Address] = [
    Address(id=1, address="г. Москва, ул. Ленина, д. 10, офис 5", is_default=True),
    Address(id=2, address="г. Москва, ул. Пушкина, д. 25, склад 3", is_default=False),
]
next_address_id = 3

@app.get("/api/addresses", response_model=list[Address])
async def get_addresses():
    return addresses_db

@app.post("/api/addresses", response_model=Address)
async def create_address(data: AddressCreate):
    global next_address_id
    
    # Если новый адрес — основной, снимаем флаг с остальных
    if data.is_default:
        for addr in addresses_db:
            addr.is_default = False
    
    new_address = Address(
        id=next_address_id,
        address=data.address,
        is_default=data.is_default,
    )
    next_address_id += 1
    addresses_db.append(new_address)
    return new_address

@app.put("/api/addresses/{address_id}", response_model=Address)
async def update_address(address_id: int, data: AddressUpdate):
    for addr in addresses_db:
        if addr.id == address_id:
            if data.address is not None:
                addr.address = data.address
            if data.is_default is True:
                # Снимаем флаг default со всех
                for a in addresses_db:
                    a.is_default = False
                addr.is_default = True
            return addr
    raise HTTPException(status_code=404, detail="Адрес не найден")

@app.delete("/api/addresses/{address_id}")
async def delete_address(address_id: int):
    global addresses_db
    for i, addr in enumerate(addresses_db):
        if addr.id == address_id:
            # Не даём удалить последний адрес
            if len(addresses_db) <= 1:
                raise HTTPException(status_code=400, detail="Нельзя удалить последний адрес")
            
            deleted = addresses_db.pop(i)
            # Если удалили основной — делаем первый оставшийся основным
            if deleted.is_default and addresses_db:
                addresses_db[0].is_default = True
            return {"message": "Адрес удалён"}
    raise HTTPException(status_code=404, detail="Адрес не найден")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)