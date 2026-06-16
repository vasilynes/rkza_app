from aiogram import Router, F
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

router = Router()  # ← Вот что группирует хендлеры

PRODUCTS_PER_PAGE = 5

# Фильтруем по callback_data прямо в декораторе
@router.callback_query(F.data == 'show_catalog')
async def show_categories(callback: CallbackQuery):
    builder = InlineKeyboardBuilder()
    
    categories = [
        ("🧾 Кассовая лента", "cat_receipt"),
        ("🏷️ Термоэтикетки", "cat_thermo"),
        ("📄 Полуглянец", "cat_semigloss"),
        ("🖨️ Риббоны", "cat_ribbon"),
    ]
    
    for text, cb_data in categories:
        builder.button(text=text, callback_data=cb_data)
    builder.adjust(1)
    
    await callback.message.edit_text(
        "Выберите категорию товаров:",
        reply_markup=builder.as_markup()
    )

@router.callback_query(F.data.startswith("cat_"))
async def show_products(callback: CallbackQuery):
    """Показываем товары конкретной категории"""
    category = callback.data  # cat_receipt, cat_thermo и т.д.
    products = await catalog_service.get_products(category)
    
    builder = InlineKeyboardBuilder()
    for p in products:
        builder.button(
            text=f"{p['name']} — {p['price']}₽",
            callback_data=f"product_{p['id']}"
        )
    builder.adjust(1)
    builder.row(
        InlineKeyboardButton(
            text="🔙 К категориям",
            callback_data="show_catalog"
        )
    )
    
    await callback.message.edit_text(
        f"Товары категории:",
        reply_markup=builder.as_markup()
    )