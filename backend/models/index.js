const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('chat', 'root', '1111',{
    host : 'localhost',
    dialect : 'mysql',
    logging : false,

})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize);
db.Friend = require('./Friend')(sequelize);
db.Schedule = require('./Schedule')(sequelize);
db.Chat = require('./Chat')(sequelize);

db.User.hasMany(db.Friend, {foreignKey : 'userId' , as : 'myFriends'});
db.Friend.belongsTo(db.User, {foreignKey : 'friendId', targetKey :'userId' , as : 'friendInfo'});

db.Chat.belongsTo(db.User, { foreignKey: 'senderId', as: 'Sender' });
db.User.hasMany(db.Chat, { foreignKey: 'senderId' });

module.exports = db;