// src/pages/ChatPlayground.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

// 서버 주소와 연결 (컴포넌트 밖에서 선언하면 재랜더링 시 중복 연결 방지 가능)
 const socket = io('http://localhost:3000');

function ChatPlayground() {
  const [friendNickname, setFriendNickname] = useState('');
  const {friendId} = useParams();
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
//  const [userCount, setUserCount] = useState(0);
  const [isFriend, setIsFriend] = useState(true);

//  const [myId] = useState(`User_${Math.floor(Math.random()*1000)}`);
  const myId = sessionStorage.getItem('userId') || 'Guest';
//  const myNickname = sessionStorage.getItem('nickname');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({title : '', date : ''});


  const addFriendAction = async () =>{
    try{

      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/add-friend',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({friendId})
      });
      const data = await response.json();
      if(data.success){
        alert('친구로 등록되었습니다.');
        setIsFriend(true);
      }
    }catch(err){
      console.error('친구 추가 실패', err);
    }
  };



  useEffect(() => {





    const fetchHistory = async() => {
    
      const response = await fetch(`http://localhost:3000/chat/history?myId=${myId}&friendId=${friendId}`,
        { method : 'GET',
          headers:{
          'Content-type' : 'application/json',
          'Authorization' : `Bearer ${sessionStorage.getItem('token')}`
              }
          }      );
      const data = await response.json();
      if(data.success) {

        const normalizedHistory = data.history.map(msg => ({

          user : msg.senderId,
          text : msg.message,
          time : new Date(msg.createdAt).toLocaleTimeString(),
          isMe : msg.senderId===myId

        }))

        setChatLog(normalizedHistory); // DB에서 가져온 과거 채팅 내역
        setIsFriend(data.isFriend);
        setFriendNickname(data.friendNickname);
      }
  
    
    };

   

    const markRead = async ()=>{

      try{

        const token = sessionStorage.getItem('token');
        await fetch('http://localhost:3000/chat/read',{
          method : 'PUT',
          headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
          },
          body : JSON.stringify({
            myId : myId , 
            friendId : friendId
          })
        });


      }catch(err){
        console.error('읽음 처리 실패', err);
      }

    };
    
    if (friendId && myId !== 'Guest'){
      markRead().then(()=>fetchHistory()); // 방에 들어오면 읽음처리
    } else if (friendId){
      fetchHistory();
    }


    

    // 기존에 혹시나 남아있을지 모를 리스너를 싹 다 지우고 시작 (중복 방지)
    socket.off('user_count');
    socket.off('receive_message');


    // 서버로부터 메세지를 받는 리스너 등록
    socket.on('receive_message', (data) => {
      setChatLog((prev) => [...prev, data]); // 기존 로그에 추가
    });

//    socket.on('user_count', (count)=>{
 //     console.log("서버에서 받은 숫자:", count);
   //   setUserCount(count);});


    // 컴포넌트 언마운트 시 리스너 제거 (중요!)
    return () => {
      socket.off('receive_message');
      socket.off('user_count')
    };



    
  }, [friendId, myId]);

  

const sendMessage = () => {
    if (message.trim()) {
      // socket.id 존재 여부를 체크하는 방어 코드
      // const userId = socket.id ? socket.id.substring(0, 5) : 'Guest';

      socket.emit('send_message', {
       senderId : myId,
        receiverId : friendId,
        text: message,
        time: new Date().toLocaleTimeString(),
        isMe : true // 내가 보낸건지 구분용 (실제론 socket.id로 비교)
      });
      setMessage('');
    }
  };


  const handleExtract = async (text) =>{

   try{

    const token = sessionStorage.getItem('token');

    const response = await fetch('http://localhost:3000/chat/analyze',
      {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({text})
      }
    );

    const result = await response.json();
    if(result.success){
      setEditData({
        title : result.extractedData.title,
        date : result.extractedData.date
      });
      setIsModalOpen(true);
    
   // const confirmSave = window.confirm(
     // `일정을 찾았습니다!\n 날짜 : ${date} \n내용 : ${title}\n\n이대로 등록할까요?`
    //);

  //  if (confirmSave){
   //   saveToDatabase(title,date);
   // }
  }

   }catch(err){
    console.error("추출 중 오류 발생", err);
    alert("서버와 통신 중 에러가 발생했습니다.");
   }
  };

   const saveToDatabase = async (title, date) => {

    try{
  
    const token = sessionStorage.getItem('token');
     const response = await fetch('http://localhost:3000/schedule/add',{
      method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({title, date})
      });
      
      const result = await response.json();
      if (result.success) {
        alert("일정이 성공적으로 등록되었습니다.");
      }
    
    }catch(err){
      console.error("저장 오류 : ", err);
    }

    };
   
   
  

  return (
   <>
    <div style = {containerStyle}>
     
      <header style = {headerStyle}>
        <h2>{friendNickname}님과의 채팅</h2>
    {/*  <span style = {countStyle}>접속중 : {userCount}명</span> */}
      </header>

       {!isFriend && friendId !== myId &&(
        <div style = {friendRequestBarStyle}>
          <span>아직 친구가 아닙니다. 친구로 등록할까요?</span>
          <button onClick ={addFriendAction} style = {addBtnStyle}>친구 추가</button>
        </div>
      )}

      <div style ={chatBoxStyle}>
      {chatLog.map((msg, i) => (
        

        <div key ={i} style ={{
          display : 'flex',
          justifyContent : msg.user === myId ? 'flex-end' : 'flex-start',
          marginBottom : '15px'
        }}>

          <div style = {msgContainerStyle(msg.user === myId)}>
            <div style ={userInfoStyle}><span style = {{fontSize : '10px'}}>{msg.time}</span></div>
        <div style = {{ display : 'flex', alignItems : 'flex-end', gap : '5px'}}>
          <div style = {bubbleStyle(msg.user === myId)}>{msg.text}</div>
          <button onClick = {()=>handleExtract(msg.text)} style = {extractBtnStyle} title = '일정으로 등록'>📅</button>
    </div>
        </div>
    </div>

      ))}
      </div>
    <div style = {inputAreaStyle}>
      <input
      style = {inputStyle}
      type = "text"
      value = {message}
      onChange = {(e)=>setMessage(e.target.value)}
      onKeyDown = {(e)=> {
        if(e.key === 'Enter'){
       if(e.nativeEvent.isComposing)  return; 
       sendMessage();}}}
      placeholder= "일정을 말해보세요 (예 : 내일 세차)"/>
<button onClick = {sendMessage} style = {sendBtnStyle}>전송</button>
    </div>
    </div>

{isModalOpen && (
  <div style = {modalOverlayStyle}>
    <div style = {modalContentStyle}>
    <h3 style = {{marginTop : 0}}>📅 일정 확인 및 수정</h3>
    <div style ={{marginBottom : '15px'}}>
    <label style = {labelStyle}>내용</label>
    <input
      style = {modalInputStyle}
      value = {editData.title}
      onChange={(e)=> setEditData({...editData, title : e.target.value})}
      />


    </div>
    <div style ={{marginBottom : '20px'}}>
    <label style = {labelStyle}>날짜</label>
    <input
    type = "date"
    style = {modalInputStyle}
    value = {editData.date}
    onChange = {(e)=> setEditData({...editData, date : e.target.value})}
    />
    </div>

    <div style = {{display : 'flex' , gap : '10px', justifyContent : 'flex-end'}}>
      <button onClick = {()=>setIsModalOpen(false)} style = {cancelBtnStyle}>취소</button> 
      <button onClick = {() => {
        saveToDatabase(editData.title, editData.date);
        setIsModalOpen(false);

      }} style = {confirmBtnStyle}>저장하기</button>
    </div>
  </div>
  </div>
)}
</>

  )
}

const containerStyle = { maxWidth: '500px', margin: '20px auto', backgroundColor: '#f5f5f5', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const headerStyle = { backgroundColor: '#333', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
// const countStyle = { fontSize: '12px', color: '#bbb' }; 
const chatBoxStyle = { height: '450px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' };
const msgContainerStyle = (isMe) => ({ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' });
const userInfoStyle = { fontSize: '11px', color: '#888', marginBottom: '4px' };
const bubbleStyle = (isMe) => ({ padding: '10px 15px', borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0', backgroundColor: isMe ? '#333' : '#fff', color: isMe ? '#fff' : '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', lineHeight: '1.4' });
const extractBtnStyle = { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', padding: '0', opacity: '0.6' };
const inputAreaStyle = { padding: '15px', backgroundColor: '#fff', display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' };
const sendBtnStyle = { padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: '#fff', cursor: 'pointer' };
const friendRequestBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    padding: '10px 20px',
    borderBottom: '1px solid #ffe58f',
    fontSize: '13px',
    color: '#856404'
};

const addBtnStyle = {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
};
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px' };
const modalInputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' };
const cancelBtnStyle = { padding: '10px 15px', border: 'none', backgroundColor: '#eee', borderRadius: '8px', cursor: 'pointer' };
const confirmBtnStyle = { padding: '10px 15px', border: 'none', backgroundColor: '#333', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };





export default ChatPlayground;