from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.utils.keyboard import ReplyKeyboardBuilder

def main_menu_keyboard(has_recent_orders: bool = False) -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()

    if has_recent_orders:
        builder.row(
            KeyboardButton(text='Повторить предыдущий заказ')
        )
        
    builder.row(
        KeyboardButton(text='Каталог товаров')
    )

    builder.row(
        KeyboardButton(text='Корзина'),
        KeyboardButton(text='Мои адреса')
    )

    builder.row(
        KeyboardButton(text='Позвонить'),
        KeyboardButton(text='О компании')
    )

    return builder.as_markup(
        resize_keyboard=True,
        persistent=True
    )
