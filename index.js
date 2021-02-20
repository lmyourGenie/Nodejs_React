const express = require('express');
//express 모듈을 가져와서 새로운 express app을 생성
const app = express();
const port = 5000;
//포트번호5000을(아무거나) 백서버로 두고

const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());


//Mongoose로 어플과 mongoDB를 연결
const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB 연결됨...'))
.catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello World! 반갑습니다 :)'));
//루트 디렉토리에 오면 hello world 출력


//회원가입을 위한 route 만들기
app.post('/register', (req, res) => {
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

app.listen(port, () => console.log('Example app listening on port' , port))