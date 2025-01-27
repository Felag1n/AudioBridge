AudioBridge
<div align="center">
Show Image
Современная музыкальная платформа для общения и обмена музыкой
Show Image
Show Image
Show Image
Show Image
</div>
О проекте
AudioBridge - это современная музыкальная платформа, вдохновленная Spotify и SoundCloud. Проект сочетает в себе функциональность стриминговой платформы с возможностями социальной сети, позволяя пользователям не только слушать музыку, но и общаться друг с другом через интеграцию с Яндекс.Музыкой.
Возможности
Основной функционал

Музыкальный плеер

Воспроизведение и пауза
Переключение между треками
Регулировка громкости
Прогресс-бар с возможностью перемотки
Интеграция с Яндекс.Музыкой


Система пользователей

Авторизация через JWT и Яндекс OAuth
Настраиваемые профили
Загрузка аватаров
Система лайков и комментариев


Социальные функции

Чат между пользователями в реальном времени
Комментарии к трекам
Система лайков
Обмен сообщениями



Интерфейс

Темная тема в стиле минимализма
Адаптивный дизайн для всех устройств
Плавные анимации и переходы
Модальное окно поиска с фильтрами
Интерактивные компоненты

Технологии
Frontend

Next.js + TypeScript
Tailwind CSS + shadcn/ui
Zustand
React Query
Framer Motion
Socket.IO Client

Backend

Django 5.1.5
Django REST Framework 3.15.2
Django CORS Headers 4.6.0
PostgreSQL
Yandex Music API 2.2.0

Хранение данных

SQLite3 (разработка)
PostgreSQL (продакшн)
Яндекс.Музыка API (аудио контент)

Начало работы
Предварительные требования

Python 3.9+
Node.js (версия 16 или выше)
npm/yarn

Зависимости сервера
txtCopyaiofiles==24.1.0
aiohappyeyeballs==2.4.4
aiohttp==3.11.11
aiosignal==1.3.2
asgiref==3.8.1
async-timeout==5.0.1
attrs==25.1.0
certifi==2024.12.14
charset-normalizer==3.4.1
Django==5.1.5
django-cors-headers==4.6.0
djangorestframework==3.15.2
frozenlist==1.5.0
idna==3.10
multidict==6.1.0
propcache==0.2.1
psycopg2-binary==2.9.10
PySocks==1.7.1
python-dotenv==1.0.1
requests==2.32.3
sqlparse==0.5.3
typing_extensions==4.12.2
tzdata==2025.1
urllib3==2.3.0
yandex-music==2.2.0
yarl==1.18.3
Установка

Клонирование репозитория

bashCopygit clone https://github.com/username/audiobridge.git
cd audiobridge

Установка зависимостей

bashCopy# Сервер (Django)
cd server
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt

# Клиент
cd client
npm install

Настройка окружения

bashCopy# Сервер
cp server/.env.example server/.env

# Клиент
cp client/.env.example client/.env

Настройка базы данных

bashCopy# Активируйте виртуальное окружение, если оно не активировано
cd server
python manage.py migrate
python manage.py createsuperuser

Запуск приложения

bashCopy# Запуск сервера
cd server
python manage.py runserver

# Запуск клиента
cd client
npm run dev
Структура проекта
## 📁 Структура проекта

```
audiobridge/
├── client/               # Клиентская часть
│   ├── components/       # React компоненты
│   ├── pages/           # Страницы Next.js
│   ├── store/           # Управление состоянием
│   └── styles/          # Стили
│
└──├── backend/               # Основное Django приложение
│   ├── __pycache__/      # Python кэш
│   ├── __init__.py       
│   ├── asgi.py           # ASGI конфигурация
│   ├── settings.py       # Настройки Django
│   ├── urls.py           # Основные URL
│   └── wsgi.py           # WSGI конфигурация
│
├── music_api/            # Приложение для работы с музыкой
│   ├── __pycache__/      
│   ├── migrations/       # Миграции базы данных
│   ├── __init__.py
│   ├── admin.py         # Настройки админ-панели
│   ├── apps.py          # Конфигурация приложения
│   ├── models.py        # Модели данных
│   ├── serializers.py   # Сериализаторы DRF
│   ├── tests.py         # Тесты
│   ├── urls.py          # URL API
│   └── views.py         # Представления API
│
├── client/              # Frontend приложение
│   ├── node_modules/    
│   ├── package.json
│   └── package-lock.json
│
├── venv/                # Виртуальное окружение Python
├── .gitignore
├── db.sqlite3          # База данных SQLite
├── manage.py           # Утилита управления Django
├── README.md
└── requirements.txt    # Зависимости Python
```

## 🌐 Развертывание

- **Frontend**: Vercel
- **Backend**: Railway/DigitalOcean
- **Контейнеризация**: Docker

## 👩‍💻 Разработка

### Порядок разработки:

1. **Проектирование БД** 
   - Создание схемы
   - Настройка связей
   - Миграции

2. **Backend**
   - API endpoints
   - WebSocket функционал
   - Интеграция с внешними сервисами

3. **Frontend**
   - Компоненты интерфейса
   - Интеграция с API
   - Оптимизация производительности

4. **Тестирование и деплой**
   - Модульные тесты
   - Интеграционные тесты
   - Настройка CI/CD

### Рекомендации по разработке:

- Следуйте принятым соглашениям по коду
- Используйте TypeScript для типизации
- Документируйте новый функционал
- Пишите тесты для нового кода

## 📄 Лицензия

Проект распространяется под лицензией MIT. Подробности в файле LICENSE.

---


