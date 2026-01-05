const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');

const saltRounds = 10;

const authController = {};

// 회원가입 로직

authController.signup = async(req,res) => {

    const {id, pw, nickname} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(pw, saltRounds);

        const newUser = await User.create({
            userId : id,
            password : hashedPassword, // 암호화된 비번
            nickname : nickname
        });
        res.status(201).json({success : true, message : "가입 완료!"});
    }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({success : false, message: "이미 존재하는 아이디"});

        }
        res.status(500).json({success : false, message: "서버 에러"})
    }
};

authController.login = async(req,res) => {

const {id, pw} = req.body;
try{
    const user = await User.findOne({
        where : {userId : id}
    });
    if (user){
         const isMatch = await bcrypt.compare(pw, user.password);
         if (isMatch){
            const token = jwtUtils.generateToken(user);
        return res.json({
            success : true,
            token : token, // 이 토큰을 프론트에 전달
            user : {userId : user.userId, nickname : user.nickname}
        });
         }
        }
        res.status(401).json({success : false, message : "아이디 또는 비밀번호가 틀림"})
   
    
}catch(err){
res.status(500).json({success : false, message : "서버 에러"});
}

};
module.exports = authController;