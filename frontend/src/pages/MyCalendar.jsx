import React, {useState, useEffect, useCallback} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function MyCalendar(){

const [events, setEvents] = useState([]);
const [isEditMode, setIsEditMode] = useState(false);
const token = sessionStorage.getItem('token');



const fetchSchedules = useCallback( async() => {
    try {
        const response = await fetch('http://localhost:3000/schedule',{
            headers : {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        if (data.success){
            const formattedEvents = data.schedules.map(s => ({
                id : s.id,
                title : s.title,
                date : s.date
            }));
            setEvents(formattedEvents);
        }
    }catch(err) 
    {console.error("일정 로딩 실패" ,err)}



},[token]);

useEffect(() => {
    fetchSchedules();
}, [fetchSchedules]);


const handleDateClick =  async (arg) =>{
    if(isEditMode) return;

    const title = prompt('새로운 일정을 입력하세요.');

    if(!title) return;


    try{
        const response = await fetch('http://localhost:3000/schedule/add',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify({title, date : arg.dateStr})
        });
    const data = await response.json();
    if(data.success){
        alert("일정 저장 완료");
        fetchSchedules();
    }
    }catch(err){alert("저장 중 오류 발생");}

};

const handleEventClick = async (info) => {

    const eventId = info.event.id;
    const currentTitle = info.event.title;
    
    if(isEditMode){
        // 수정 모드
        const newTitle = prompt('수정할 내용을 입력하세요.', currentTitle);
        if(!newTitle || newTitle === currentTitle) return;

        try{
            const response = await fetch('http://localhost:3000/schedule/update',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
            body : JSON.stringify({id : eventId, title : newTitle})
            })
            
            const data = await response.json();
            if(data.success){
                alert('수정 완료!');
                fetchSchedules();
            }

        }catch(err){alert('수정 실패!')}
    }else{

    

    // info.event.title 등에 클릭한 일정 정보가 들어있음

    if(window.confirm(`'${info.event.title}'일정을 삭제하시겠습니까?`)){
        try{
            const response = await fetch('http://localhost:3000/schedule/delete',{
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({

                    // FullCalendar의 id 속성을 쓰거나
                    // 저장할때 title/date 조합으로 찾아서 지워야함
                    // 가장 좋은건 DB의 ID를 event의 id로 넣어두는것
                    id : info.event.id

                })
            });

            const data = await response.json();
            
            if(data.success){
                alert('삭제되었습니다.');
                fetchSchedules(); // 새로고침
            }
        }catch(err){
            alert('삭제 실패');
        }
    }

}

};


return(
    <div style = {calendarContainerStyle}>

        <div style = {{marginBottom : '10px', textAlign : 'left'}}>

            <button 
            onClick ={()=>setIsEditMode(!isEditMode)}
            style = {{
                padding : '10px 20px',
                backgroundColor: isEditMode ? '#ff9800' : '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
            }}
            
            >
                {isEditMode ? '수정 모드 활성화 중' : '일정 수정하기'}
            </button><br/><br/>

            {isEditMode && <span style = {{marginLeft: '10px', color: '#666'}}>수정할 일정을 클릭하세요.</span>}

        </div>
        <FullCalendar
        plugins = {[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events = {events} // 일정 데이터 연결
        dateClick = {handleDateClick} // 날짜 클릭시 이벤트
        eventClick = {handleEventClick} // 삭제 이벤트
        locale='ko'
        height='80vh'
        />
    </div>
);


}
const calendarContainerStyle = {
    padding: '20px',
    backgroundColor: '#fff', // 일단 흰색으로 보고 나중에 CSS로 다크모드 입히자!
    borderRadius: '10px',
    margin: '20px'
};

export default MyCalendar;