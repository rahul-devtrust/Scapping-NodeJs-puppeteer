'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Posts.init({
    post_id: DataTypes.STRING,
    fb_id:DataTypes.STRING,
    sender: DataTypes.STRING,
    group_name: DataTypes.STRING,
    content: DataTypes.STRING,
    like: DataTypes.INTEGER,
    share: DataTypes.STRING,
    comment: DataTypes.INTEGER,
    group_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    img: DataTypes.STRING,
    search_type:DataTypes.STRING,
    search_text:DataTypes.STRING,
    post_date:DataTypes.DATE,
    post_link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};