// models/Friend.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Friend = sequelize.define('Friend', {
        // 친구 관계의 고유 번호
        idx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 친구 신청을 한 사람 (나)
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // 친구 신청을 받은 사람 (상대방)
        friendId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // 관계 상태 (나중에 수락/거절 기능을 넣을 대비)
        status: {
            type: DataTypes.ENUM('pending', 'accepted'),
            defaultValue: 'accepted' // 지금은 일단 바로 친구가 되게 설정
        }
    }, {
        timestamps: true // 언제 친구가 됐는지 알 수 있게!
    });

    return Friend;
};