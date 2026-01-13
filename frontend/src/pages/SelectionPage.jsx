import React from 'react';
import {useNavigate} from 'react-router-dom';

function SelectionPage({setIsLoggedIn}){

const navigate = useNavigate();
const nickname = sessionStorage.getItem('nickname') || '사용자';
const userId = sessionStorage.getItem('userId') || 'ID 없음';

const handleLogout = () => {

if (window.confirm("로그아웃 하시겠습니까?")){

  sessionStorage.removeItem('token');
  sessionStorage.removeItem('nickname');
  sessionStorage.removeItem('userId');
  setIsLoggedIn(false);
  navigate('/login');



}


};

return(

  
  <div style = {containerStyle}>
    <div style = {profileSectionStyle}>
  <div style = {{textAlign : 'left'}}>
    <h2 style = {{color : 'white', margin : 0}}>{nickname}</h2>
    <p style = {{color : '#61dafb', margin : 0, fontSize : '14px'}}> ID : {userId}</p>

  </div>

<button onClick = {handleLogout} style = {logoutBtnStyle}>로그아웃</button>

</div>

 <p style = {{color : 'white' , margin : '20px 0 30px 0'}}>원하는 기능을 선택하세요.</p>

<div style = {menuGridStyle}>
<button style = {cardButtonStyle} onClick = {() => navigate('/mycalendar')}>
<span style = {iconStyle}>📅</span>
<span style = {labelStyle}>캘린더</span>
</button>

<button style = {cardButtonStyle} onClick = {() => {
  const myId = sessionStorage.getItem('userId');
  navigate(`/chat/${myId}`)}}>
<span style = {iconStyle}>💭</span>
<span style = {labelStyle}>나와의 채팅</span>
</button>

<button style = {cardButtonStyle} onClick = {() => navigate('/schedule-list')}>
<span style = {iconStyle}>📝</span>
<span style = {labelStyle}>일정 관리</span>
</button>

<button style = {cardButtonStyle} onClick = {() => navigate('/search-friend')}>
<span style = {iconStyle}>🔍</span>
<span style = {labelStyle}>친구 검색</span>
</button>

<button style = {cardButtonStyle} onClick = {() => navigate('/chat-list')}>
<span style = {iconStyle}>💬</span>
<span style = {labelStyle}>채팅 목록</span>
</button>

<button style = {cardButtonStyle} onClick = {() => navigate('/friend-list')}>
<span style = {iconStyle}>👤</span>
<span style = {labelStyle}>친구 목록</span>
</button>



</div>
</div>
)





}
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#282c34',
    padding: '40px 20px',
};

const profileSectionStyle = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '15px',
    boxSizing: 'border-box'
};

const logoutBtnStyle = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px'
};

const menuGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2열로 배치
    gap: '15px',
    width: '100%',
    maxWidth: '400px'
};

const cardButtonStyle = {
    backgroundColor: '#3e4451',
    border: 'none',
    borderRadius: '15px',
    padding: '30px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    color: 'white'
};

const iconStyle = { fontSize: '2.5rem', marginBottom: '10px' };
const labelStyle = { fontSize: '1rem', fontWeight: 'bold' };

export default SelectionPage;