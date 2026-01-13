import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

function MyFriendPage(){

    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        fetchFriends();
    },[]);

    const fetchFriends = async () => {
        const token = sessionStorage.getItem('token');

        try{
            const response = await fetch('http://localhost:3000/user/friends', {
                headers : {'Authorization' : `Bearer ${token}`}
            });
        
        const data = await response.json();
        if(data.success){
            setFriends(data.friends);
        }
        }catch (err){
            console.error('친구 목록 불러오기 실패', err);
        }


    };

    const deleteFriend = async(friendId) => {
        if(!window.confirm('정말 삭제하시겠습니까?')) return;

        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3000/user/delete-friend' , {
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({friendId})
        });


        const data = await response.json();
        if(data.success){
            alert('삭제되었습니다.');
            fetchFriends();
        }


    };


    return(
        <div style = {containerStyle}>
            <button onClick = {()=>navigate(-1)} style ={backBtnStyle}>← 뒤로</button>
        <h2 style = {{color : 'white'}}>내 친구 목록</h2>
        
            <div style = {listContainerStyle}> 
            {friends.length > 0 ? (
                friends.map((f,index) => (
                    <div key = {index} style = {friendCardStyle}>
                        <div style = {infoSectionStyle}>
                        <span style = {{fontSize : '1.5rem'}}>👤</span>
                        <span style = {nicknameStyle}>
                        {f.friendInfo.nickname}
                        </span>
                        </div>
                        <div style= {buttonGroupStyle}>
                        <button onClick = {()=> navigate(`/chat/${f.friendInfo.userId}`)} style = {chatBtnStyle}>
                            채팅
                        </button>
                        <button 
                        onClick={() => deleteFriend(f.friendInfo.userId)} style = {deleteBtnStyle}>삭제</button>
                    </div>
                        </div>
                ) )
            ) : 
            (<p style = {{color : 'white'}}>아직 추가된 친구가 없습니다.</p>)
            }
            </div>
        
        </div>


    );


}
const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1d23', padding: '40px 20px', fontFamily: 'sans-serif' };
const backBtnStyle = { alignSelf: 'flex-start', backgroundColor: 'transparent', color: '#61dafb', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' };
const listContainerStyle = { width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '12px' };

// 🏁 카드 스타일 수정 (양 끝 정렬)
const friendCardStyle = { 
    backgroundColor: '#2c313c', 
    padding: '12px 20px', 
    borderRadius: '12px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', // 이게 핵심! 왼쪽(이름)과 오른쪽(버튼)을 벌림
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const infoSectionStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const nicknameStyle = { color: 'white', fontWeight: 'bold', fontSize: '15px' };

// 🏁 버튼들을 묶어서 간격 조절
const buttonGroupStyle = { display: 'flex', gap: '8px' };

const chatBtnStyle = { 
    backgroundColor: '#61dafb', 
    color: '#1a1d23', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 'bold'
};

const deleteBtnStyle = { 
    backgroundColor: 'transparent', // 삭제는 너무 튀지 않게 테두리만
    color: '#ff4d4d', 
    border: '1px solid #ff4d4d', 
    borderRadius: '6px', 
    cursor: 'pointer',
    padding: '5px 10px',
    fontSize: '13px'
};
export default MyFriendPage;