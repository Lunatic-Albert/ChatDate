import React, {useState} from 'react';
//import { useNavigate } from 'react-router-dom';

function SearchFriendPage() {

    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState(null);
    const myNickname = sessionStorage.getItem('nickname');
   // const navigate = useNavigate();

    const handleSearch = async() =>{

        const token = sessionStorage.getItem('token');
        try{
            const response = await fetch(`http://localhost:3000/user/search?nickname=${keyword}`,
                {headers : {'Authorization' : `Bearer ${token}`}}
            );
            const data = await response.json();

            if (data.success){
                setResult({...data.user,
                    isFriend : data.isFriend
            });

            }else{
                alert(data.message);
                setResult(null);
            }
        }catch(err){
        alert("검색 중 오류 발생");
    }
};

const addFriend = async(friendId) => {
    const token = sessionStorage.getItem('token');


    try{
        const response = await fetch('http://localhost:3000/user/add-friend',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json', 
                'Authorization' : `Bearer ${token}`          
            },
            body : JSON.stringify({friendId}),
          
        });
        const data = await response.json();

        if (data.success){
            alert("친구 추가 성공!");
            setResult(prev => ({ ...prev, isFriend : true}));
        }else {
            alert(data.message); // 백엔드에서 보낸 에러 메시지 표시
        }
    }catch(err){
        alert("친구 추가 중 오류 발생");
    }
    
    };



return(
    <div style = {containerStyle}>
     {/* <button onClick ={() => navigate(-1)} style = {backBtnStyle}>←뒤로 가기</button> */}
        <h2 style = {{color : 'white'}}>🔍<br/>친구 검색</h2>

    <div style = {searchBoxStyle}>
        <input
        type = "text"
        placeholder = "닉네임 입력"
        value = {keyword}
        onChange = { (e) => setKeyword(e.target.value)}
        style = {inputStyle}
        />
        <button onClick = {handleSearch} style = {searchBtnStyle}>검색</button>

    </div>


    {result && (
        <div style = {resultCardStyle}>
            <div style = {userInfoStyle}>
                <span style = {avatarStyle}>👤</span>
                <div>
            <div style = {{color : 'white', fontWeight : 'bold'}}>
                {result.nickname}
                {result.nickname === myNickname && <span style = {meBadgeStyle}>(나)</span>}
                
                     </div>

            </div>

     </div>


            {result.nickname !== myNickname && (
                result.isFriend ? (
                    <span style = {{color : 'white', fontSize: '14px'}}>이미 친구입니다.</span>
                ) : 
                <button style = {addBtnStyle} onClick ={()=>addFriend(result.userId)}>친구 추가</button>
            )}

         </div>
   ) }
    </div>
);
}








const containerStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  minHeight: '100vh', backgroundColor: '#282c34', padding: '40px 20px'
};

//const backBtnStyle = {
//  alignSelf: 'flex-start', backgroundColor: 'transparent', color: '#61dafb',
//  border: 'none', cursor: 'pointer', marginBottom: '20px'
//};

const searchBoxStyle = { display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', marginBottom: '30px' };

const inputStyle = {
  flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444',
  backgroundColor: '#333', color: 'white', outline: 'none'
};

const searchBtnStyle = {
  padding: '12px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#61dafb', color: '#282c34', fontWeight: 'bold', cursor: 'pointer'
};

const resultCardStyle = {
  width: '100%', maxWidth: '400px', backgroundColor: '#333', padding: '20px',
  borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const userInfoStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const avatarStyle = { fontSize: '2rem', backgroundColor: '#444', padding: '10px', borderRadius: '50%' };
const meBadgeStyle = { marginLeft: '8px', fontSize: '11px', backgroundColor: '#555', padding: '2px 6px', borderRadius: '4px', color: '#aaa' };
const addBtnStyle = { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };


export default SearchFriendPage; 