# 🎵 AudioBridge

<div align="center">

![AudioBridge Logo](http://via.placeholder.com/500x150)

### Современная музыкальная платформа для общения и обмена музыкой

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-ea2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Начало работы](#-начало-работы)
- [Структура проекта](#-структура-проекта)
- [Развертывание](#-развертывание)
- [Разработка](#-разработка)

## 🎯 О проекте

AudioBridge - это современная музыкальная платформа, вдохновленная Spotify и SoundCloud. Проект сочетает в себе функциональность стриминговой платформы с возможностями социальной сети, позволяя пользователям не только слушать музыку, но и общаться друг с другом.

## ✨ Возможности

### 🎹 Основной функционал

- **Музыкальный плеер**
  - Воспроизведение и пауза
  - Переключение между треками
  - Регулировка громкости
  - Прогресс-бар с возможностью перемотки
  - Визуализация аудио

- **Система пользователей**
  - Авторизация через JWT и Яндекс OAuth
  - Настраиваемые профили
  - Загрузка аватаров
  - Система лайков и комментариев

- **Социальные функции**
  - Чат между пользователями в реальном времени
  - Комментарии к трекам
  - Система лайков
  - Обмен сообщениями

### 🎨 Интерфейс

- Темная тема в стиле минимализма
- Адаптивный дизайн для всех устройств
- Плавные анимации и переходы
- Модальное окно поиска с фильтрами
- Интерактивные компоненты

## 🛠 Технологии

### Frontend
```
➤ Next.js + TypeScript
➤ Tailwind CSS + shadcn/ui
➤ Zustand
➤ React Query
➤ Framer Motion
➤ Socket.IO Client
```

### Backend
```
➤ NestJS + TypeScript
➤ PostgreSQL + Prisma
➤ Redis
➤ Socket.IO
➤ JWT + OAuth
```

### Хранение данных
```
➤ Cloudinary / AWS S3 (медиафайлы)
➤ PostgreSQL (основные данные)
➤ Redis (кеширование)
```

## 🚀 Начало работы

### Предварительные требования

- Node.js (версия 16 или выше)
- PostgreSQL
- Redis
- npm или yarn

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/username/audiobridge.git
cd audiobridge
```

2. **Установка зависимостей**
```bash
# Сервер
cd server
npm install

# Клиент
cd ../client
npm install
```

3. **Настройка окружения**
```bash
# Сервер
cp server/.env.example server/.env

# Клиент
cp client/.env.example client/.env
```

4. **Настройка базы данных**
```bash
cd server
npx prisma migrate dev
```

5. **Запуск приложения**
```bash
# Запуск сервера
cd server
npm run start:dev

# Запуск клиента
cd client
npm run dev
```

## 📁 Структура проекта

```
audiobridge/
├── client/               # Клиентская часть
│   ├── components/       # React компоненты
│   ├── pages/           # Страницы Next.js
│   ├── store/           # Управление состоянием
│   └── styles/          # Стили
│
└── server/              # Серверная часть
    ├── prisma/          # Схема БД и миграции
    ├── src/             # Исходный код
    │   ├── modules/     # Модули приложения
    │   └── main.ts      # Точка входа
    └── test/            # Тесты
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


