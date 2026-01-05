// toy/backend/utils/dateParser.js

// 'date-fns' 라이브러리에서 'format' 함수를 가져옴.
// 추출된 JavaScript Date 객체를 'YYYY-MM-DD HH:MM:SS' 형식의 문자열로 변환하는 데 사용됨.
const { format } = require('date-fns');

// './chronoKo'에서 커스터마이징된 chrono 인스턴스를 가져옴.
// 이 모듈은 자연어 텍스트에서 날짜와 시간을 분석하는 핵심 도구야.
const chrono = require('chrono-node');

/**
 * 사용자 메시지에서 날짜 정보를 분석하고 메모와 분리하여 반환하는 함수.
 * * @param {string} message - 사용자가 입력한 채팅 메시지 (예: "내일 2시에 회의")
 * @param {Date} referenceDate - 날짜를 추정하기 위한 기준 시점 (기본값: 현재 시점)
 * @returns {{date: string | null, memo: string}} - 포맷된 날짜 문자열과 분리된 메모 객체
 */
function parseSchedule(message, referenceDate = new Date()) {
    
    // 1. 입력 유효성 검사
    if (!message || typeof message !== 'string') {
        // 메시지가 없거나 문자열이 아니면 날짜를 null로, 메모를 빈 문자열로 반환하고 종료
        return {
            date: null,
            memo: ''
        };
    }

    // 2. Chrono를 이용한 날짜 분석
    // chrono.parse()를 사용하여 메시지 분석을 시도함.
    // { forwardDate: true } 옵션은 현재 시점보다 미래의 날짜만 결과로 고려하도록 지정함.
    const results = chrono.parse(message, referenceDate, {
        forwardDate: true
    });

    // 3. 분석 실패 처리
    if (!results || results.length === 0) {
        // Chrono가 메시지에서 유효한 날짜 키워드를 찾지 못하면
        // 날짜를 null로, 메시지 전체를 메모로 반환하고 종료 (일정 감지 실패)
        return {
            date: null,
            memo: message.trim()
        };
    }

    // 4. 분석 성공 시 데이터 추출
    
    // Chrono는 여러 결과를 반환할 수 있지만, 여기서는 첫 번째 결과만 사용함 (가장 유력한 날짜).
    const parsedResult = results[0];
    
    // Chrono 결과 객체에서 JavaScript의 Date 객체를 추출함.
    const extractedDate = parsedResult.start.date();

    // Chrono가 메시지에서 '날짜로 인식한 텍스트' (예: "내일 2시")를 추출함.
    const parsedText = parsedResult.text;
    
    // 원본 메시지에서 parsedText를 제거하여 순수한 메모 부분만 남김.
    let memo = message.replace(parsedText, '').trim();

    // 5. 날짜 포맷 및 최종 객체 반환

    // 추출된 Date 객체를 'YYYY-MM-DD HH:MM:SS' 형식의 문자열로 변환함.
    const formattedDate = format(extractedDate, 'yyyy-MM-dd HH:mm:ss');

    // 최종 결과 객체 반환
    return {
        date: formattedDate, // 포맷된 날짜 문자열
        // 메모가 비어있으면 기본값 ('일정 제목 없음')을 사용하고, 아니면 분리된 메모를 사용함.
        memo: memo.length > 0 ? memo : '일정 제목 없음' 
    };
}

// 이 파일을 외부에서 사용할 수 있도록 함수를 모듈로 내보냄.
module.exports = {
    parseSchedule
};