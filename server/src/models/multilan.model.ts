"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Translation extends Model {
    static associate(models: any) {
      // Optional: Add index for faster lookups
      Translation.addScope('defaultScope', {
        include: [{
          model: models.Product,
          required: false
        }, {
          model: models.Category,
          required: false
        }]
      });
    }
  }

  Translation.init({
    model: DataTypes.STRING,
    recordId: DataTypes.UUID,
    language: DataTypes.STRING(2),
    field: DataTypes.STRING,
    translation: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Translation',
    indexes: [
      { fields: ['model', 'recordId'] },
      { unique: true, fields: ['model', 'recordId', 'language', 'field'] }
    ]
  });

  return Translation;
};