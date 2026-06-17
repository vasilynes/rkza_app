import asyncio
import logging 
from aiogram import Bot, Dispatcher
from t_bot.config import BOT_TOKEN
from handlers.start import router as start_router

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

dp.include_router(start_router)

async def main():
    print('T-Bot is running!')
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())