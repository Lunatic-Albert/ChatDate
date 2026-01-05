const {User, Friend} = require('../models');
const jwtUtils = require('../utils/jwtUtils');

const userController = {};

// id 검색해서 친구 찾기
userController.searchUser =  async (req, res) =>{

const {nickname}= req.query;
const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

try{
    const decoded = jwtUtils.verifyToken(token, 'g70');
        const myId = decoded.userId;
    // 정확히 일치하는 ID찾기(id, nickname)
    const user = await User.findOne({where : {nickname : nickname}, attributes: ['userId', 'nickname'] });

    if(!user){
        return res.status(404).json({success : false, message : '사용자를 찾을 수 없습니다.'});

    }
    // 이미 친구인지 확인
    const isFriend = await Friend.findOne({
        where : {userId : myId, friendId : user.userId}
    })

res.status(200).json({success : true, user,isFriend: !!isFriend});
}catch(err){
    console.error('검색 에러', err);
    res.status(500).json({success : false, message : "서버 통신 오류"});
}

};


userController.addFriend = async (req, res) => {

const {friendId} = req.body; // 프론트에서 보낼 상대방 ID

const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token){
    return res.status(401).json({success : false, message : '토큰이 없습니다.'});

}
try{
    // 토큰 해독
    const decoded = jwtUtils.verifyToken(token, 'g70');

    const userId = decoded.userId;

    if(userId === friendId){
        return res.status(400).json({success : false, message : "본인은 추가할 수 없습니다."});

    }
    const exFriend = await Friend.findOne({ where : {userId, friendId}});
    if(exFriend){
        return res.status(400).json({success : false, message : '이미 친구로 추가 되어 있습니다.'})
    }

    await Friend.create({userId, friendId});
    res.status(200).json({ success : true, message : '친구 추가 성곧!'})

}catch(err){
    console.error(err);
    res.status(500).json({ success : false, message : '유효하지 않은 토큰'});
}
};


// 친구 목록

userController.getFriends = async (req, res) => {
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({success: false, message : '토큰이 없습니다.'});
    }

    try{
           const decoded = jwtUtils.verifyToken(token, 'g70');
           const userId = decoded.userId;


           const friends = await Friend.findAll({
            where : {userId : userId},
            include : [{
                model : User,
                as : 'friendInfo',
                attributes : ['userId', 'nickname']
            }]
           });

           console.log('로그인한 유저 ID:', userId); // 1. 내가 누구인지 찍힌다
console.log('찾은 친구 수:', friends.length); // 2. 몇 명이 검색됐는지 찍힌다
console.log('데이터 구조:', JSON.stringify(friends, null, 2)); // 3. friendInfo가 들어있는지 확인
           res.status(200).json({success : true, friends});
    } catch(err){
        console.error('친구 목록 불러오기 에러' , err);
        res.status(500).json({success: false, message : '서버 오류'});

    }

};

userController.deleteFriend = async(req, res) => {
    const {friendId} = req.body;
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        const decoded = jwtUtils.verifyToken(token, 'g70');
        const userId = decoded.userId;

        console.log("-------------------------------");
        console.log("내 아이디(userId):", userId);
        console.log("삭제할 친구(friendId):", friendId);
        console.log("-------------------------------");
 
        await Friend.destroy({
            where : {userId, friendId}
        });
        res.status(200).json({success : true, message : "친구 삭제 완료"});

    }catch (err) {
        res.status(500).json({success : false, message : '서버 오류'});
    }


};



module.exports = userController;
