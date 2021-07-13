'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Groups.init({
    group_name: DataTypes.STRING,
    link: DataTypes.STRING,
    group_id: DataTypes.STRING,
    group_type:DataTypes.STRING,
    members:DataTypes.STRING,
    img: DataTypes.STRING,
    type_and_member: DataTypes.STRING,
    group_other_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Groups',
  });
  return Groups;
};