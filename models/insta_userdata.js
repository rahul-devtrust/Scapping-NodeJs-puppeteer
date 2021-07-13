'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insta_userdata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  insta_userdata.init({
    profile_name: DataTypes.STRING,
    profilepic: DataTypes.STRING,
    user_name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    total_post: DataTypes.STRING,
    followers: DataTypes.STRING,
    following: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'insta_userdata',
  });
  return insta_userdata;
};