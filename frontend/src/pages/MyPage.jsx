import React from 'react';
import {useNavigate} from 'react-router-dom';

function MyPage(){

    const navigate = useNavigate();
    const nickname = sessionStorage.getItem('nickname'); // 저장했던 닉네임 꺼내기


    const handleLogout = () =>{

        sessionStorage.removeItem('token'); 
        sessionStorage.removeItem('nickname');

        alert('로그아웃 되었습니다.');
        navigate('/');
    };



    return(

        <div style = {{ textAlign : 'center', marginTop : '50px' , color : 'white' }}>
            <h2> 마이페이지 </h2>
        <p style = {{fontSize : '1.2rem'}}>
        <span style = {{ color : '#61dafb' , fontWeight : 'bold'}}>{nickname}</span>
        </p>

<div style = {{ marginTop : '30px'}}>
    <button onClick = { ()=> navigate('/schedule')} style = {menuBtnStyle}>내 일정 보기</button>
        <br/>
        <button onClick = {handleLogout} style = {logoutBtnStyle}>로그아웃</button>
        </div>
</div>


    );


}

const menuBtnStyle = { padding: '10px 20px', width: '200px', marginBottom: '10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #61dafb', backgroundColor: 'transparent', color: '#61dafb' };
const logoutBtnStyle = { padding: '10px 20px', width: '200px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#ff4b2b', color: 'white', fontWeight: 'bold' };



export default MyPage;
