'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class y_trending extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  y_trending.init({
    v_title: DataTypes.STRING,
    v_channel_name: DataTypes.STRING,
    v_channel_views: DataTypes.STRING,
    v_channel_date: DataTypes.STRING,
    v_description: DataTypes.TEXT,
    v_img: DataTypes.TEXT,
    v_channel_video_url: DataTypes.STRING,
    v_duration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'y_trending',
  });
  return y_trending;
};