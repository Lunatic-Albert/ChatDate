const {Schedule} = require('../models');
const jwtUtils = require('../utils/jwtUtils');

const scheduleController = {};

// 일정 저장
scheduleController.addSchedule = async (req, res) => {
    try{
        const {title, date} = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({success : false, message : '인증 토큰이 없습니다.' })
        }


            const decoded = jwtUtils.verifyToken(token, 'g70');
            const userId = decoded.userId;

            const newSchedule = await Schedule.create({
                title,
                date,
                userId
            });
            res.status(200).json({ success : true , schedule : newSchedule, message :'일정 저장 성공!'});
    }catch(err){
        console.error("일정 저장 에러", err);
        res.status(500).json({success : false, message : '서버 오류'});
    }
}

// 일정 조회

scheduleController.getSchedule = async (req,res) => {

try {
         const authHeader = req.headers['authorization'];
         const token = authHeader && authHeader.split(' ')[1];

         if(!token){
            res.status(401).json({success : false, message : '인증 토큰이 없습니다.' })
        }


            const decoded = jwtUtils.verifyToken(token, 'g70');
            const userId = decoded.userId;

            const schedules = await Schedule.findAll({
                where : {userId}
            });

            res.status(200).json({success : true, schedules});


}catch(err){
        console.error("일정 저장 에러", err);
        res.status(500).json({success : false, message : '서버 오류'});
}




};


// 일정 삭제 

scheduleController.deleteSchedule = async (req, res) => {

    try{
        const {id} = req.body; // 지울 일정의 고유 ID
      

       const result =  await Schedule.destroy({
            where : {id : Number(id)}
        });
       
        
        if(result){
            res.status(200).json({success : true});

        } else {
            res.status(400).json({success : false , message : "삭제할 일정을 찾지 못했습니다."})
        }

    }catch(err){
            console.error("일정 삭제 에러", err);
        res.status(500).json({success : false});
    }


}


scheduleController.updateSchedule = async (req, res) => {
    try{
        const {id, title} = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({success : false, message : '토큰이 없습니다.'});
        }
        const decoded = jwtUtils.verifyToken(token, 'g70');
        
        if(!decoded){
            return res.status(401).json({success : false, message : '인증 실패'});
        }


        const result = await Schedule.update(
            {title : title},{where : {id : id}}
        );

        if(result[0]>0){
        res.status(200).json({success : true});
    }else{
        res.status(404).json({success : false, message : "수정할 대상을 찾지 못했습니다."});
    }
    } catch(err){
        console.log('수정 에러', err);
        res.status.json({success : false});
    }
}

module.exports = scheduleController;