const { User } = require("../models/User");

let auth = (req, res, next) => {

    //인증 처리를 하는 곳
/*
클라이언트 쿠키에서 토큰을 가져옴(cookie parser)
-> 토큰을 복호화(decode)한 후 유저를 찾음
-> 유저가 있으면 인증 Okay
-> 유저가 없으면 인증 No !
*/

    let token = req.cookies.x_auth;
    
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next(); //next 존재 이유 : 이건 미들웨어니까 next가 없으면 여기에 갇히게됨
    })
    //메서드 생성
}

module.exports = { auth };