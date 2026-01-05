// toy/backend/db.js

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3'); // sqlite 모듈이 내부적으로 사용할 드라이버

let db; // 데이터베이스 객체를 저장할 변수

async function initializeDatabase() {
    try {
        // 데이터베이스 연결 또는 생성
        db = await sqlite.open({
            filename: './schedule.db', // 파일 이름
            driver: sqlite3.Database // 사용할 드라이버 지정
        });

        console.log('Database connected successfully.');

        // 테이블 생성 쿼리 실행
        await db.exec(`
            CREATE TABLE IF NOT EXISTS schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                memo TEXT NOT NULL,
                date TEXT,
                createdAt TEXT
            );
        `);

        console.log('Schedules table checked/created.');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// DB 인스턴스와 초기화 함수를 내보냅니다.
module.exports = {
    initializeDatabase,
    getDb: () => db 
};