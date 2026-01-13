import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage(){

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        // 유효성 검사
        if (!id || !pw || !nickname) return alert("모든 항목을 입력하세요.");
        if (pw !== confirmPw) return alert("비밀번호 불일치");
    
        try{
            // 백엔드 서버로 회원가입 정보 전송
            const response = await fetch("http://localhost:3000/login/signup",{
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, pw, nickname})

            }

            );

            const result = await response.json();

            if(result.success){
                alert("회원가입 성공!");
                navigate("/login");

            }else {
                alert(result.message || "가입 실패");
            }
            }catch(err){
                console.error("회원가입 에러", err);
            } 


        };

        return(
            <div style = {containerStyle}>
                <div style ={cardStyle}>
                <h1>계정 생성</h1>

                <div style = {inputGroupStyle}>
                    <label style ={labelStyle}>아이디</label>
                <input type = 'text' placeholder='ID를 입력하세요.' value={id} onChange={(e)=>setId(e.target.value)} style ={inputStyle}/><br/>
                </div>

  <div style = {inputGroupStyle}>
      <label style ={labelStyle}>닉네임</label>
<input type = 'text' placeholder='사용할 이름' value={nickname} onChange={(e)=>setNickname(e.target.value)} style ={inputStyle}/><br/>
</div>


  <div style = {inputGroupStyle}>
      <label style ={labelStyle}>비밀번호</label>
<input type = 'password' placeholder='비밀번호' value={pw} onChange={(e)=>setPw(e.target.value)} style ={inputStyle}/><br/>
</div>

 <div style = {inputGroupStyle}>
      <label style ={labelStyle}>비밀번호 확인</label>
<input type = 'password' placeholder='한번 더 입력' value={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)} style ={inputStyle}/><br/>
</div>
<button onClick={handleSignup} style = {signupBtnStyle}>가입하기</button>

<div style = {footerStyle}>
            <span style = {{color : '#888'}}>이미 계정이 있나요?</span>
             <button onClick={()=>navigate('/login')} style = {cancelBtnStyle}>로그인 하러가기</button>
              </div>
              </div>
                </div>
        );
    }

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f9f9f9', // 연한 그레이 배경
  fontFamily: 'sans-serif'
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  textAlign: 'left'
};



const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '8px', marginLeft: '4px' };

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  color: '#333',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const signupBtnStyle = {
  width: '100%',
  padding: '15px',
  backgroundColor: '#333', // 묵직한 블랙
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
};

const footerStyle = { marginTop: '25px', textAlign: 'center', fontSize: '13px' };
const cancelBtnStyle = {
  background: 'none',
  color: '#333',
  cursor: 'pointer',
  border: 'none',
  marginLeft: '8px',
  fontWeight: 'bold',
  textDecoration: 'underline'
};

export default SignupPage;