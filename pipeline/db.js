const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const db = client.db('menzadb');
const menus = db.collection('menus');

const getMenu = async (date) => {
  return await menus.findOne({ date });
}

const uploadMenus = async (newMenus) => {
  menus.insertMany(newMenus);
}

module.exports = { getMenu, uploadMenus };