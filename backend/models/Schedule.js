// models/Schedule.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // 여기서 DataTypes가 제대로 넘어왔는지 확인하는 안전장치
    if (!DataTypes) {
        throw new Error("DataTypes is undefined. Check your models/index.js!");
    }

    const Schedule = sequelize.define('Schedule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY, // YYYY-MM-DD 형식
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Schedules', // 테이블 이름 명시 (선택사항)
        timestamps: true        // createdAt, updatedAt 자동 생성
    });

    return Schedule;
};