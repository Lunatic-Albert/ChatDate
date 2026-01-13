import React from 'react';
import {Navigate} from 'react-router-dom';

const ProtectionRoute = ({children}) => {

    const token = localStorage.getItem('token');

    // 토큰이 없으면 '/'로 강제 이동

    if(!token){
        alert("로그인이이 필요합니다.");
                                    // replace = 잘못된 접근 기록을 지워버림. 로그인창에서 '뒤로 가기'를 눌러서 다시 마이페이지(차단된 곳)로 가는 무한 루프를 방지
        return <Navigate to ="/login" replace />;
    }

    return children;

};

export default ProtectionRoute;

// 이거는 프론트엔드 보호 영역이라 차후 백엔드 영역 보호 로직 필요 