const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const http = require('http');
const { Server } = require('socket.io');
const {sequelize, User, Chat} = require('./models');

const { initializeDatabase } = require('./db');
const { getKstNowString, KST_TIMEZONE } = require('./utils/timeUtils');
const scheduleRouter = require('./routes/scheduleRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const scheduleListRouter = require('./routes/scheduleListRouter');
const app = express();
const PORT = 3000; // 백엔드 포트

const server = http.createServer(app);

const mysql = require('mysql2/promise');



// [수정] 프론트엔드 포트 3005 허용
app.use(cors({
    origin: 'http://localhost:3005' ,
    credentials: true
}));
app.use(bodyParser.json());

app.use('/schedule', scheduleRouter);
app.use('/login', authRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/schedule-list', scheduleListRouter);



app.get('/api/status', (req, res) => {
    const kstNow = getKstNowString();
    res.status(200).json({
        status: 'ok',
        timestamp_kst: kstNow
    });
});



// [수정] 소켓 CORS 설정도 3005로 변경
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3005",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    
    console.log('새로운 유저 접속 ID:', socket.id);

    const userCount = io.engine.clientsCount; // 현재 접속자 수 가져오기

    // 2. 모든 유저에게 현재 인원수 전송 (이벤트명: 'user_count')
  
    io.emit('user_count', userCount);

    socket.on('send_message', async (data) => {
        
        const{senderId,receiverId,text} = data;

        try{
            // DB에 저장
            const savedChat = await Chat.create({
                senderId : senderId,
                receiverId : receiverId,
                message : text,
                isRead : false 
            });
                     io.emit('receive_message', {
                        user : savedChat.senderId,
                        text : savedChat.message,
                        time : new Date(savedChat.createdAt).toLocaleTimeString(),
                        id : savedChat.id
                     });
        

        }catch(err){
            console.error('채팅 저장 중 에러 발생', err);
        }



      
    });
    

    socket.on('disconnect', () => {
        const currentUserCount = io.engine.clientsCount;
        console.log(`유저 나감. 현재 인원: ${currentUserCount}명`);
        io.emit('user_count', currentUserCount);
    });
});

// [중요] 모든 서버 시작 로직을 이 함수 안에서 처리
async function startServer() {
    try {
        await initializeDatabase();
       await sequelize.authenticate();
       await sequelize.sync({alter : true}); // 테이블 자동생성/수정 force: true는 테이블 Drop & 데이터 초기화
        console.log("MySQL 및 기존 DB 연결 완료");

        // app.listen을 지우고 server.listen만 사용!
        server.listen(PORT, () => {
            console.log(`Backend Server running on http://localhost:${PORT}`);
            console.log(`프론트엔드(3005) 접속을 허용합니다.`);
        });
    } catch (err) {
        console.error("서버 시작 실패:", err);
    }
}

startServer();