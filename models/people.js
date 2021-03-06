'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class people extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  people.init({
    people_name: DataTypes.STRING,
    people_link: DataTypes.STRING,
    people_id: DataTypes.STRING,
    img: DataTypes.STRING,
    people_other_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'people',
  });
  return people;
};