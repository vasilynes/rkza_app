from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

def main_menu_keyboard(has_recent_orders: bool = False) -> ReplyKeyboardMarkup:
    keyboard = []
    
    if has_recent_orders:
        keyboard.append([
            KeyboardButton(text='Повторить предыдущий заказ'),
            KeyboardButton(text='Недавние заказы')
        ])
    
    keyboard.extend([
        [KeyboardButton(text='Каталог товаров')],
        [KeyboardButton(text='Позвонить')]
    ])
    
    return ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True
    )