const {Schedule} = require('../models');
const jwtUtils = require('../utils/jwtUtils');

const scheduleListController = {};

scheduleListController.getScheduleList = async (req, res) => {
    try{
          const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) return res.status(401).json({success : false , message : "토큰이 없습니다."});

        const decoded = jwtUtils.verifyToken(token, 'g70');
        if(!decoded) return res.status(400).json({success : false, message : "토큰 인증 실패"});

        // 모든 일정을 가져오되, 날짜순으로 정렬

        const schedules = await Schedule.findAll({

            where : {userId : decoded.userId},
            order : [['date', 'ASC']] // DB엔진에서 미리 정렬 (오름차순)

        });

        res.status(200).json({success : true , schedules});

    }catch(err){
        console.error('리스트 조회 에러', err);
        res.status(500).json({success : false});
    }

};

module.exports = scheduleListController;