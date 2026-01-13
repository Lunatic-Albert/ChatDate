import React, { useState, useEffect } from 'react';


function ChatPage() {

  const [status, setStatus] = useState('서버 상태 확인중...');
  const [echoResponse, setEchoResponse] = useState('POST 응답 대기중...');
  const [schedules, setSchedules] = useState([]);
  const [chatInput, setChatInput] = useState('');

  /* =========================
     1️⃣ 최초 로딩 시: 서버 상태 + 일정 목록 조회
  ========================= */
  useEffect(() => {

    // 서버 상태 확인
    fetch('http://localhost:3000/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(`서버 상태 : ${data.message} (${data.timestamp_kst})`);
      })
      .catch(() => {
        setStatus('서버 연결 실패 (백엔드 확인)');
      });

    // 일정 목록 조회
    fetch('http://localhost:3000/api/schedule/list')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSchedules(data.schedules);
        }
      })
      .catch(err => {
        console.error('일정 목록 조회 실패:', err);
      });

  }, []); // ❗ 최초 1회만 실행

  /* =========================
     2️⃣ 버튼 클릭 → 일정 분석 & 저장
  ========================= */
  const sendSchedule = () => {

    if (!chatInput.trim()) {
      setEchoResponse('입력값이 비어있습니다.');
      return;
    }

    fetch('http://localhost:3000/api/schedule/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatMessage: chatInput
      }),
    })
      .then(res => res.json())
      .then(data => {

        if (data.status === 'schedule_detected') {
          setEchoResponse(
            `일정 감지 성공 | 날짜: ${data.schedule.date} | 메모: ${data.schedule.memo}`
          );
          setChatInput('');

          // 저장 후 목록 다시 조회
          return fetch('http://localhost:3000/api/schedule/list');
        } else {
          setEchoResponse(`일정 없음 | 서버 메세지: ${data.message}`);
          return null;
        }
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.status === 'success') {
          setSchedules(data.schedules);
        }
      })
      .catch(err => {
        console.error('POST 실패:', err);
        setEchoResponse('POST 통신 실패');
      });
  };

  /* =========================
     3️⃣ UI
  ========================= */
  return (
    <div className="App">
      <header className="App-header">

        <h1>Toy Project 일정 분석 테스트</h1>

        <p><strong>GET 상태:</strong> {status}</p>

        <hr style={{ width: '80%' }} />

        {/* 입력창 */}
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="채팅 메세지를 입력하세요"
          style={{
            padding: '10px',
            width: '50%',
            fontSize: '16px',
            marginBottom: '10px'
          }}
        />

        <br />

        <button
          onClick={sendSchedule}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          메세지 분석 및 일정 저장
        </button>

        <p style={{ marginTop: '20px' }}>
          <strong>POST 응답:</strong> {echoResponse}
        </p>

        <hr style={{ width: '80%', marginTop: '30px' }} />

        <h2>저장된 일정 목록</h2>

        <div style={{ textAlign: 'left', width: '60%', margin: '10px auto' }}>
          {schedules.length > 0 ? (
            schedules.map(schedule => (
              <div
                key={schedule.id}
                style={{ borderBottom: '1px solid #444', padding: '10px 0' }}
              >
                <p>
                  <strong>ID:</strong> {schedule.id} | 예정일: {schedule.date || '날짜 미지정'}
                </p>
                <p style={{ color: '#ccc', marginLeft: '10px' }}>
                  메모: {schedule.memo}
                </p>
              </div>
            ))
          ) : (
            <p>저장된 일정이 없습니다.</p>
          )}
        </div>

      </header>
    </div>
  );
}

export default ChatPage;