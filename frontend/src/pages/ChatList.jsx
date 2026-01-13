import React , {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function ChatList(){


    const [list , setList] = useState([]);
    const myId = sessionStorage.getItem('userId');
    const navigate = useNavigate();
    const formatTime = (dateString) => {
        const now = new Date();
        const msgDate = new Date(dateString);
        const diff = (now - msgDate) / 1000; //초단위

        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff/60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff/3600)}시간 전`;
        return msgDate.toLocaleDateString();

        
    }


    useEffect(()=>{
        const fetchList = async ()=>{
            const response = await fetch(`http://localhost:3000/chat/list?myId=${myId}`,{
            headers : {'Authorization':`Bearer ${sessionStorage.getItem('token')}`}
        });
const data = await response.json();
if(data.success) {
    setList(data.chatList||[]);
}
        };

       if(myId) fetchList();
}, [myId]);


return(
    <div style = {containerStyle}>
        <header style = {headerStyle}><h2>채팅 목록</h2></header>

        <div style = {listAreaStyle}>
        {list.map((chat, i) =>(
            <div key = {i} style = {itemStyle} onClick={()=> navigate(`/chat/${chat.friendId}`)}>
                <div style ={avatarStyle}>
                    {(chat.friendNickname || chat.friendId)[0].toUpperCase()}
                    </div>

                <div style = {contentStyle}>

                    <div style = {nameRowStyle}>
                        <span style = {nameStyle}>{chat.friendNickname || chat.friendId}</span>
                          <span style = {timeStyle}>{new Date(chat.createdAt).toLocaleDateString()}</span>

                            </div>

                            <div style ={{display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                             <div style = {lastMsgStyle}>{chat.text}</div>
                         {chat.unreadCount > 0 &&(
                            <span style = {unreadBadgeStyle}>{chat.unreadCount}</span>
                        )}
                        <span>{formatTime(chat.createdAt)}</span>
                      </div>
                       
                    </div>
                   
            </div>
         
        ))}
        {list.length === 0 && <div style ={{textAlign : 'center', padding : '50px', color : '#999'}}>대화 내역이 없습니다.</div>}
        </div>
    </div>
);

}




const containerStyle = { maxWidth: '500px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden' };
const headerStyle = { backgroundColor: '#333', color: 'white', padding: '15px', textAlign: 'center' };
const listAreaStyle = { height: '550px', overflowY: 'auto' };
const itemStyle = { display: 'flex', padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', alignItems: 'center', transition: 'background 0.2s' };
const avatarStyle = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '15px' };
const contentStyle = { flex: 1 };
//const nameRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' };
const nameStyle = { fontWeight: 'bold', color: '#333' };
const timeStyle = { fontSize: '11px', color: '#999' };
const lastMsgStyle = { fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' };

const unreadBadgeStyle = {
    backgroundColor: '#ff4d4f',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 7px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '15px',
    textAlign: 'center',
    marginLeft: '5px'
};

// nameRowStyle은 양 끝으로 벌려주는 속성이 이미 있으니까 그대로 써도 됨
const nameRowStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', // 세로 중앙 정렬 추가하면 더 좋음
    marginBottom: '5px' 
};
export default ChatList;