from aiogram import Router
from aiogram.filters import Command
from aiogram.fsm import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message
from utils.validators import is_valid_inn

router = Router()

class Registration(StatesGroup):
    waiting_for_inn = State()
    waiting_for_address = State()
    waiting_for_phone = State()


@router.message(Command('start'))
async def start_handler(message: Message, state: FSMContext):
    # client = await client_service.get_by_telegram_id(message.from_user.id)

    # if client:
    #     recent = await order_service.has_recent(client['id'])

    #     await message.answer(
    #         f"С возвращением, {client.company_name}!",
    #         reply_markup=main_menu_keyboard(recent)
    #     )
    #     return

    await message.answer(
        'Добро пожаловать! Для регистрации введите ИНН Вашей компании.\n\n'
        'Пример: 7707083893'
    )
    await state.set_state(Registration.waiting_for_inn)

@router.message(Registration.waiting_for_inn)
async def process_inn(message: Message, state: FSMContext):
    inn = message.text.strip()

    if not is_valid_inn(inn):
        await message.answer('Неверный ИНН. Попробуйте еще раз:')
        return

    # client_data = await client_service.find_by_inn(inn)

    # if not client_data:
    #     await message.answer(
    #         'Клиент с таким ИНН не найден.'
    #     )
    #     return
    
    # await state.update_date(inn=inn, company_name=client_data['name'])