import { Model, DataTypes } from 'sequelize';

export function initCarouselModel(sequelizeInstance) {
  class Carousel extends Model { }

  Carousel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'carousel_picture',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Carousel;
}
