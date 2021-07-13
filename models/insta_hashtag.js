'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insta_hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  insta_hashtag.init({
    hashtag: DataTypes.STRING,
    post_id: DataTypes.STRING,
    post_content_img: DataTypes.TEXT,
    post_like: DataTypes.STRING,
    post_view: DataTypes.STRING,
    post_content_video: DataTypes.TEXT,
    post_caption: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'insta_hashtag',
  });
  return insta_hashtag;
};