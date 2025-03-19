require('dotenv').config();

module.exports = {
  config: {
    app_name: process.env.APP_NAME,
    app_version: process.env.APP_VERSION,
    image_path: process.env.IMAGE_PATH,
    db: {
      HOST: process.env.DB_HOST,
      USER: process.env.DB_USER,
      PASSWORD: process.env.DB_PASSWORD,
      DATABASE: process.env.DB_DATABASE,
      PORT: process.env.DB_PORT,
    },
    token: {
      access_token_key: process.env.ACCESS_TOKEN_KEY,
    },
  },
};
