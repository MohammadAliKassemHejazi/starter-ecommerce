"use strict";

import { Model, UUIDV4, DataTypes, Sequelize } from "sequelize";
import { ICommentAttributes } from "../interfaces/types/models/comment.model.types";

module.exports = (sequelize: Sequelize) => {
  class Comment extends Model<ICommentAttributes> implements ICommentAttributes {
    id!: string;
 
      text!: string;
      rating!: number;

    static associate(models: any) {
      Comment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      Comment.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id' });
    }
  }

  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: "Comment",
    tableName: "Comments",
    timestamps: true,
  });

  return Comment;
};
