const {Chat} = require('../models');
const {Friend} = require('../models')
const {User} = require('../models')
const {Op} = require('sequelize');
const {sequelize} = require('../models');


const chatController = {};

// 나중에 주소창에 id 노출되는거 숨기자





chatController.markAsRead = async (req, res) =>{
    try{
        const {myId , friendId} = req.body;

        await Chat.update(
{ isRead: true },
      { 
        where: { 
          senderId: friendId, 
          receiverId: myId, 
          isRead: false 
        } 
      }

        );
        res.status(200).json({success : true});

    }catch(err){
        console.error('읽음 처리 에러', err);
        res.status(500).json({success :false});
    }
};



chatController.getChatList = async (req,res)=>{

try{

    const {myId} = req.query;




// 시퀄라이즈로 그룹화해서 최신 메시지 추출 (생쿼리로 짜는 게 성능상 유리할 수 있음)
    const [results] = await sequelize.query(`
    SELECT 
    m1.senderId, 
    m1.receiverId, 
    m1.message as text, 
    m1.createdAt,
    -- 상대방 ID 구하기
    CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END as friendId,
    -- 상대방 닉네임 가져오기
    u.nickname as friendNickname,
    -- 🔥 안 읽은 메시지 개수 추가 (상대방이 보냈고, 내가 아직 안 읽은 것)
    (SELECT COUNT(*) 
     FROM Chats 
     WHERE senderId = (CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END)
       AND receiverId = :myId 
       AND isRead = false) as unreadCount
  FROM Chats m1
  INNER JOIN (
    SELECT 
      LEAST(senderId, receiverId) as p1, 
      GREATEST(senderId, receiverId) as p2, 
      MAX(createdAt) as max_date
    FROM Chats
    WHERE senderId = :myId OR receiverId = :myId
    GROUP BY p1, p2
  ) m2 ON LEAST(m1.senderId, m1.receiverId) = m2.p1 
      AND GREATEST(m1.senderId, m1.receiverId) = m2.p2 
      AND m1.createdAt = m2.max_date
  LEFT JOIN Users u ON u.userId = (CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END)
  ORDER BY m1.createdAt DESC
    `, { replacements: { myId } });

    res.status(200).json({success : true , chatList : results});

}catch(err){
    console.error(err);
    res.status(500).json({success : false});
}

};



chatController.getChatHistory = async (req, res) =>{

    try{

        const {myId, friendId } = req.query;

        console.log("채팅내역 조회 : ", {myId, friendId});

        //나랑 친구 사이의 모든 대화 가져오기
        const history = await Chat.findAll({
            where : {
                [Op.or] : [
                    {senderId : myId, receiverId : friendId},
                    {senderId : friendId, receiverId:myId}
                ]
            },

            include : [{
                model : User,
                as : 'Sender',
                attributes : ['nickname'],
                required : false
            }],

            order: [['createdAt', 'ASC']] // 시간순 정렬]
        });

        const friendUser = await User.findOne({
            where : {userId : friendId},
            attributes : ['nickname']
        })


        const friendCheck = await Friend.findOne({
            where : {
                userId : myId,
                friendId : friendId
            }
        });


        res.status(200).json({success : true, history, isFriend : !!friendCheck,
            friendNickname : friendUser ? friendUser.nickname : friendId
        });

    }catch(err){
        console.error('History API 에러 상세:', err);
        res.status(500).json({success : false , message : '채팅 로딩 실패'})
    }


};


chatController.analyzeChat = async (req ,res) =>{

    try{

        const {text} = req.body;
        
        if(!text){
            return res.status(400).json({success : false , message : '텍스트가 없습니다.'});
        }

            const today = new Date();
            let targetDate = new Date();
            let title = text; 

if (text.includes('내일')) {
            targetDate.setDate(today.getDate() + 1);
            title = text.replace('내일', '').trim();
        } else if (text.includes('오늘')) {
            targetDate = today;
            title = text.replace('오늘', '').trim();
        } else if (text.includes('모레') || text.includes('이틀뒤')) {
            targetDate.setDate(today.getDate() + 2);
            title = text.replace(/모레|이틀뒤/, '').trim(); // 둘 중 걸린 놈 지우기
        } else if (text.includes('사흘뒤') || text.includes('3일뒤')) {
            targetDate.setDate(today.getDate() + 3);
            title = text.replace(/사흘뒤|3일뒤/, '').trim();
        } else if (text.includes('나흘뒤') || text.includes('4일뒤')) {
            targetDate.setDate(today.getDate() + 4);
            title = text.replace(/나흘뒤|4일뒤/, '').trim();
        } else if (text.includes('다음주')) {
            targetDate.setDate(today.getDate() + 7);
            title = text.replace('다음주', '').trim();
        } else {
            // "10일뒤" 처럼 숫자가 포함된 경우를 위한 로직 
            const match = text.match(/(\d+)일뒤/);
            if (match) {
                targetDate.setDate(today.getDate() + parseInt(match[1]));
                title = text.replace(match[0], '').trim();
            }
        }

        // YYYY-MM-DD
        const formattedDate = targetDate.toISOString().split('T')[0];

        // 분석 결과 반환
        res.status(200).json({
            success : true,
            extractedData : {
                title : title || '일정이 있습니다.',
                date : formattedDate
            }
        });


    }catch(err){
        console.error("채팅 분석 에러" , err);
        res.status(500).json({success : false, message : "서버 분석 오류"});
    }

};

module.exports = chatController;