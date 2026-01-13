import React, {useState, useEffect, useCallback} from 'react';


function ScheduleList(){

    const [schedules, setSchedules] = useState([]);
    const token = sessionStorage.getItem('token');


    const fetchSchedules = useCallback( async () => {

        try{
            const response = await fetch('http://localhost:3000/schedule-list',{
                method : 'GET',
                headers  : { 'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'}
            });
            const data = await response.json();
            if(data.success){

                // 날짜순으로 정렬
                const sorted = data.schedules.sort((a,b)=> new Date(a.date) - new Date(b.date));
                setSchedules(sorted);
            }


        }catch(err){
            console.error("리스트 로딩 실패", err);
        }
    },[token]);

    useEffect(() => {
        fetchSchedules();
    },[fetchSchedules]);


    return (
        <div style = {containerStyle}>
            <h2 style = {titleStyle}>📋 전체 일정 리스트</h2>

            <table style = {tableStyle}>
            <thead>
               <tr style = {headerRowStyle}>
                <th style = {dateColumnStyle}>날짜</th>
                <th style = {titleColumnStyle}>내용</th>
                <th style = {actionColumnStyle}>관리</th>
                </tr> 
            </thead>
                <tbody>
                    {schedules.map((s)=>(
                        <tr key = {s.id} style = {rowStyle}>
                            <td style = {dateColumnStyle}>{s.date}</td>
                            <td style = {titleColumnStyle}>{s.title}</td>
                        <td style = {actionButtonStyle}>
                            {/*차후 이미지 뽑기 기능 위치*/}
                            <button style={actionButtonStyle}>내보내기</button>
                        </td>
                        </tr>
                    ))

                    }
                </tbody>



            </table>
{schedules.length === 0 && <p style = {emptyMessageStyle}>등록된 일정이 없습니다.</p>}
        </div>

    );

}
const containerStyle = { 
    maxWidth: '800px', // 너무 넓게 퍼지지 않게 제한
    margin: '40px auto', 
    padding: '30px', 
    backgroundColor: '#fff', 
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)' // 은은한 그림자
};

const titleStyle = { textAlign: 'center', marginBottom: '20px', color: '#333' };

const tableStyle = { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '10px',
    tableLayout: 'fixed' // 컬럼 너비를 고정해서 정렬 유지
};

const headerRowStyle = { 
    borderBottom: '2px solid #1a1a1a',
    backgroundColor: '#f8f9fa' 
};

const rowStyle = { 
    borderBottom: '1px solid #eee',
    transition: 'background 0.2s'
};

// 공통 컬럼 스타일 (th, td 둘 다 적용해서 줄 맞춤)
const dateColumnStyle = { 
    padding: '15px', 
    width: '120px', 
    textAlign: 'left', // 왼쪽 정렬 통일
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
};

const titleColumnStyle = { 
    padding: '15px', 
    textAlign: 'left', 
    fontSize: '14px',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis' // 내용 길면 ... 처리
};

const actionColumnStyle = { 
    padding: '15px', 
    width: '80px', 
    textAlign: 'center' 
};

const actionButtonStyle = { 
    padding: '6px 12px', 
    backgroundColor: '#333', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '12px'
};

const emptyMessageStyle = { 
    textAlign: 'center', 
    padding: '40px', 
    color: '#999' 
};

export default ScheduleList;