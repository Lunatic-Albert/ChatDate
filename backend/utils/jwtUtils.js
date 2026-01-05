const jwt = require('jsonwebtoken');

// .env 로 옮겨야함
const SECRET_KEY = 'g70';

const jwtUtils = {

    // 1. 토큰 생성

    generateToken : (user) =>{
        const payload = {
            userId : user.userId,
            nickname : user.nickname
        };

        // 유효시간 1시간 설정
        return jwt.sign(payload, SECRET_KEY, { expiresIn : '1h'});
    },

    // 2. 토큰 검증
    
    verifyToken : (token) => {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch(err){
            return null;
        }

    }
};

module.exports = jwtUtils;