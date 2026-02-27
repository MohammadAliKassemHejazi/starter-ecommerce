'use strict';
import { Model, DataTypes } from 'sequelize';

module.exports = (sequelize: any) => {
  class Translation extends Model {
    static associate(models: any) {
      // Translation doesn't have direct associations with Product/Category
      // It uses polymorphic relationships via model and recordId fields
    }
  }

  Translation.init(
    {
      model: DataTypes.STRING,
      recordId: DataTypes.UUID,
      language: DataTypes.STRING(2),
      field: DataTypes.STRING,
      translation: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Translation',
      indexes: [{ fields: ['model', 'recordId'] }, { unique: true, fields: ['model', 'recordId', 'language', 'field'] }],
    },
  );

  return Translation;
};
