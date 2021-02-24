const express = require('express');
//express 모듈을 가져와서 새로운 express app을 생성
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require("./models/User");
const config = require('./config/key');

const { auth } = require("./middleware/auth");

//application/x-www-form-urlencoded
app.use('/mock',bodyParser.urlencoded({extended: true}));

//application/json
app.use('/mock',bodyParser.json());
app.use(cookieParser());

//Mongoose로 어플과 mongoDB를 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB 연결됨...'))
.catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World! 반갑습니다 :)'));
//루트 디렉토리에 오면 hello world 출력

app.get('/api/hello', (req, res) => res.send('Hello World!'));


//회원가입을 위한 route 만들기
app.post('/api/users/register', (req, res) => {
  //회원가입에 필요한 정보들을 client에서 가져오면
  //그것들을   데이터 베이스에 넣어준다.
  
  const user = new User(req.body);
  //req.body에는 json형식으로 데이터가 저장됨
  //이건 body-parser를 다운받은 덕분


  //여기서, 즉 저장하기 전에 비번을 암호화함
  //User.js 확인

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    
    return res.status(200).json({
      success: true
    })
  }) //몽고DB에 저장
})


app.post('/api/users/login', (req, res) => {
  
  /*
  요청된 이메일이 DB에 있는지 찾음
  -> 비밀번호가 같은지 확인
  -> 토큰 생성
  */
 
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log('user', user)
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 정보가 없습니다."
      })
    }

    //비교 메서드 설정
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
  
      //비밀번호까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        //토큰을 저장함 (어디? 쿠키, 로컬스토리지 등...)
        //이 앱은 쿠키에 저장
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
//auth라는 미들웨어 추가
//callback function 하기 전에 중간에서
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,  //임의로 role 0 -> 일반유저 role 0외의 수 -> 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id},
    { token: "" },
    (err, user) => {
      if(err) return res.json({ success: false, err })

      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => console.log('Example app listening on port' , port))