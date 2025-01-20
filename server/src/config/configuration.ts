export default () => ({
  // Основные настройки сервера
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // База данных
  database: {
    url: process.env.DATABASE_URL,
  },
  
  // JWT настройки
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Яндекс OAuth
  yandex: {
    clientId: process.env.YANDEX_CLIENT_ID,
    clientSecret: process.env.YANDEX_CLIENT_SECRET,
    callbackURL: process.env.YANDEX_CALLBACK_URL,
  },
  
  // CORS
  cors: {
    frontendUrl: process.env.FRONTEND_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  },
  
  // Загрузка файлов
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '10mb',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});