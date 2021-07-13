'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Events.init({
    event_name: DataTypes.STRING,
    event_link: DataTypes.STRING,
    event_id: DataTypes.STRING,
    event_description: DataTypes.STRING,
    event_type: DataTypes.STRING,
    people_went: DataTypes.STRING,
    people_intrested: DataTypes.STRING,
    event_date: DataTypes.DATE,
    custom_date: DataTypes.STRING,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Events',
  });
  return Events;
};