const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10; //10자리 salt 하나를 만들어서 비밀번호를 암호화한다

//스키마 생성
const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,

    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//비밀번호 암호화를 위해
userSchema.pre('save', function(next){

    var user = this;

    if(user.isModified('password')){
        bcrypt.getSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                //hash가 암호화된 비번을 의미
                if(err) return next(err)
                user.password = hash
                //hash된 비번으로 바꿔주는 것
                next()
            })
        })
    }
})

const User = mongoose.model('User', userSchema)

//다른파일에서도 쓸 수 있도록
module.exports = { User }