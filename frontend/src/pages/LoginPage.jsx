import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';



function LoginPage ({onLogin}){

const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const nickname = sessionStorage.getItem('nickname');


    useEffect(()=>{
        const token = sessionStorage.getItem('token');
        if(token){
            setIsLoggedIn(true);
        }
    },[])

    const handleLogin = async() => {
        try{
            const response = await fetch('http://localhost:3000/login',{
                method : "POST",
                headers :{ "Content-Type" : "application/json" },
            body : JSON.stringify({id,pw}),
            });

            const result = await response.json();
            if(result.success){

                // 서버가 준 토큰을 로컬 스토리지에 'token'이라는 이름으로 저장
                // localStorage.setItem('token', result.token);
                sessionStorage.setItem('token', result.token);
                
                // 유저 정보도 필요하면 저장 (선택 사항)
                // localStorage.setItem('nickname', result.user.nickname);
                sessionStorage.setItem('nickname', result.user.nickname);

                localStorage.setItem('userId' , result.user.userId);
                sessionStorage.setItem('userId' , result.user.userId);

                alert(`${result.user.nickname}님 환영합니다!`);
                navigate('/select');
           
                // 여기서 성공시 화면 이동 또는 유저 정보 저장
            } else {
                alert(result.message);
            }
        }catch(err){
            console.error("로그인 에러", err);
            alert("서버 통신 오류");
        }

    }

    const handleLogout = () =>{
        sessionStorage.clear();
        setIsLoggedIn(false);
        alert("로그아웃 되었습니다.");
    };
    

    return(

    <div style = {containerStyle}>
      <h1 style = {{ fontSize : '3rem' , color : 'white'      }}> ChatDate </h1>
<h2 style = {{color : 'white'}}> 일정 분석 및 관리 서비스 </h2>

<div style = {imageWrapperStyle}>
    <img
    src = "/ChatDate.png"
    alt = "ChatDate Main"
    style = {mainImageStyle}
    />

</div>

{ isLoggedIn ? (
    <div style = {{ marginTop : '30px', width : '100%', maxWidth : '300px', textAlign : 'center'}}> 
        <p style = {{color : 'white', marginBottom : '20px'}}>
        <span style = {{color : 'white', fontWeight : 'bold'}}>{nickname}님 접속중</span>
        </p>
        <button onClick={()=>navigate('/select')} style = {loginBtnStyle}>
        메뉴 선택 화면으로 이동
        </button>
        <button onClick={handleLogout} style ={{...loginBtnStyle, backgroundColor : '#ff4d4d', marginTop:'10px'}}>
            로그아웃
        </button>
         </div>
) : 

( <>
<div style = {{marginTop : '30px'}}>

<input type = 'text' placeholder='아이디' value={id} onChange = {(e)=>setId(e.target.value)} style = {inputStyle}/>
<br/>
<input type = 'password' placeholder='비밀번호' value={pw} onChange={(e)=>setPw(e.target.value)} style ={inputStyle}/>
<br/>

<button onClick = {handleLogin} style = {loginBtnStyle}>로그인</button>



</div>

<div style ={{marginTop : '20px'}}>
    <span style={{color : '#ccc', fontSize : '14px'    }}> 계정이 없으신가요? </span>
        <button onClick={()=>navigate('/signup')} style ={{signupBtnStyle}}>회원가입</button>
</div>
</>
)
}
    </div>
    );


}
// --- 스타일 (반응형 고려) ---
const containerStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#282c34', // 어두운 배경색 추가
    padding: '20px' 
};

const imageWrapperStyle = {
    width: '100%',
    maxWidth: '400px', // 이미지가 너무 커지지 않게 제한
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center'
};

const mainImageStyle = {
    width: '100%',      // 부모 너비에 맞춤
    height: 'auto',     // 비율 유지
    borderRadius: '15px' // 모서리 둥글게 (선택 사항)
};

const inputStyle = { 
    padding: '12px', 
    width: '100%',      // 부모(maxWidth 300px)에 꽉 차게
    boxSizing: 'border-box', // 패딩 포함 너비 계산
    marginBottom: '10px', 
    borderRadius: '5px', 
    border: '1px solid #444', 
    backgroundColor: '#333', 
    color: 'white' 
};

const loginBtnStyle = { 
    padding: '12px', 
    width: '100%', 
    backgroundColor: '#61dafb', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '1rem'
};

const signupBtnStyle = { 
    background: 'none', 
    border: 'none', 
    color: '#61dafb', 
    cursor: 'pointer', 
    textDecoration: 'underline' 
};
export default LoginPage;