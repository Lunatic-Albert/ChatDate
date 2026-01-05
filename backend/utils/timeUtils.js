
const KST_TIMEZONE = 'Asia/Seoul';

// 현재 KST 시간을 문자열로 얻는 함수
function getKstNowString(){
  const options = {
    year : 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, //24시간 형식 사용
    timeZone: KST_TIMEZONE,
  };
  const kstDateTime = new Date().toLocaleString('ko-KR', options);
const cleanedString = kstDateTime
        // '2025. 12. 11. 16:48:28'에서 점(.) 제거
        .replace(/\./g, '') 
        // 년,월,일 사이에 공백이 남아있을 수 있으므로 하이픈으로 대체
        .replace(/ /g, '-').trim(); 
        
    // 이제 '2025-12-11-16:48:28' 형태가 됨. 여기서 날짜와 시간 사이의 하이픈을 공백으로 바꿈.
    
    // 날짜 부분 (2025-12-11)과 시간 부분 (16:48:28)을 분리하여 재결합
    const yearMonthDay = cleanedString.substring(0, 10); // '2025-12-11'
    const finalTime = cleanedString.substring(11); // '16:48:28'
    
    // 최종 포맷: YYYY-MM-DD HH:mm:ss
    return `${yearMonthDay} ${finalTime}`;
}

module.exports = {
    getKstNowString,
    KST_TIMEZONE // 다른 모듈에서 사용할 수 있도록 내보내기.

};