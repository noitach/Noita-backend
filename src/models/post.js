import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export function initPostModel(sequelizeInstance) {
  class Post extends Model { }
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title_fr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_de: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content_fr: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content_de: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'post',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Post;
}

const Post = initPostModel(sequelize);

export default Post;
