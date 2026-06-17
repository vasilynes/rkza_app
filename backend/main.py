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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)