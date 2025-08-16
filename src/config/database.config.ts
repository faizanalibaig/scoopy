import { Sequelize } from 'sequelize';

interface CONFIG {
  database: string;
  username: string;
  password: string;
  host: string;
}

const config: CONFIG = {
  database: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
