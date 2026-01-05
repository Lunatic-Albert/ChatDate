const jwtUtils = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {

     // 헤더에서 토큰 추출 (보통 Authorization : Bearer 토큰 형식으로 보냄)
     const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[i];

    if(!token){
        return res.status(401).json({ success: false, message: "로그인이 필요한 서비스"});

    }

    // 토큰 검증
    const decoded = jwtUtils.verifyToken(token);

    if(!decoded){
        return res.status(403).json({ success : false, message : "유효하지 않은 토큰"});

    }


    // 검증 성공시 유지 정보를 req 객체에 담아서 다음으로 넘김
    req.user = decoded;
    next();

};

module.exports = authMiddleware;