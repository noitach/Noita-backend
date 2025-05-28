import { Model, DataTypes } from 'sequelize';

export function initConcertModel(sequelizeInstance) {
  class Concert extends Model { }

  Concert.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      venue: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'concert',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Concert;
}
