const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    if (!DataTypes) {
        throw new Error("DataTypes is undefined. Check your models/index.js!");
    }

    const Chat = sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: DataTypes.TEXT, // 긴 메시지도 가능하게 TEXT 타입
            allowNull: false
        },
        senderId: {
            type: DataTypes.STRING, // 보낸 유저 ID
            allowNull: false
        },
        receiverId: {
            type: DataTypes.STRING, // 받는 유저 ID
            allowNull: false
        },
        isRead: {
            type: DataTypes.BOOLEAN, // 읽음 표시 기능을 위해 슬쩍 추가 (기본값 false)
            defaultValue: false
        }
    }, {
        tableName: 'Chats',
        timestamps: true // createdAt이 곧 '메시지 보낸 시간'이 됨!
    });

    return Chat;
};