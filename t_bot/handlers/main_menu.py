from aiogram import Router, F
from aiogram.types import Message
from aiogram.fsm.context import FSMContext

router = Router()

@router.message(F.text == 'Каталог товаров')
async def open_catalog(message: Message, state: FSMContext):
    await message.answer(
        'Выберите категорию:'
    )

@router.message(F.text == 'Корзина')
async def open_cart(message: Message):
    # cart = await cart_service.get_card(message.from_user.id)

    # if not cart:
    #     await message.answer('Ваша корзина пуста.')
    #     return
    
    await message.answer(
        'Корзина'
    )
    return 

@router.message(F.text == 'Мои адреса')
async def show_addresses(message: Message):
    # addresses = await client_service.get_addresses(
    #     client_id=message.from_user.id
    # )

    await message.answer(
        'Адреса'
    )

@router.message(F.text == 'Позвонить')
async def call_me(message: Message):
    await message.answer(
        'Наши контакты:'
    )

@router.message(F.text == 'Повторить предыдущий заказ')
async def repeat_order(message: Message):
    # last_order = await order_service.get_last_order(message.from_user.id)
    
    # if not last_order:
    #     await message.answer('Нет недавних заказов')
    #     return
    
    await message.answer(
        'Ваши последние заказы'
    )

