export default () => ({
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    tokenExpiration: process.env.JWT_EXPIRATION || "15d",
    jwtSecret: process.env.JWT_SECRET || "jwtSecret11546584894dfgedsfaqrwgqwgqw8t7265602",
  },

  mongoURL: process.env.MONGO_URL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminUserName: process.env.FIRST_ADMIN_USERNAME,
  clientUserName: process.env.FIRST_CLIENT_USERNAME,
  clientPassword: process.env.CLIENT_PASSWORD,

  email: {
    emailAppPassword: process.env.EMAIL_APP_PASSWORD,
  },
});
