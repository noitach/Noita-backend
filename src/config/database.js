import { Sequelize } from 'sequelize';

// Database connection we want to use underscored naming strategy
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME}`,
  {
    define: {
      underscored: true,
    },
  }
);

export default sequelize;
