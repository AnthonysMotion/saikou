// database.js
const { Sequelize, DataTypes } = require('sequelize');

// Create a new SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'anime.db', // Specify the name of your database file
});

// Define the Anime model
const Anime = sequelize.define('Anime', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plotSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  genres: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  released: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  episodes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Sync the model with the database
const initDatabase = async () => {
  await sequelize.sync();
};

module.exports = { Anime, initDatabase };
