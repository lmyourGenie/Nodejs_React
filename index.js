const express = require('express')
//express 모듈을 가져와서 새로운 express app을 생성
const app = express()
const port = 5000
//포트번호5000을(아무거나) 백서버로 두고


//Mongoose로 어플과 mongoDB를 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ImyourGenie:dbwls1007@practice0218.yk5qy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))
  //루트 디렉토리에 오면 hello world 출력

app.listen(port, () => console.log('Example app listening on port ${port}!'))