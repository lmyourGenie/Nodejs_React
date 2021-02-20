const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10; //10자리 salt 하나를 만들어서 비밀번호를 암호화한다
const jwt = require('jsonwebtoken');

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
        //비밀번호가 바뀔 때만 암호화시킴
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                //hash가 암호화된 비번을 의미
                if(err) return next(err)
                user.password = hash
                //hash된 비번으로 바꿔주는 것
                next()
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword와 암호화된 비밀번호가 같은지 확인
    //-> plainPassword를 암호화하여 비교
    bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
        if(err) return cb(err),
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    //jsonwebtoken을 이용하여 토큰을 생성하기
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        
        cb(null, user)
    })
    //user._id + 'secretToken' = token

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //Token을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음,
        //클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({ "_id": decoded,  "token": token }, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })



    })
}

const User = mongoose.model('User', userSchema)

//다른파일에서도 쓸 수 있도록
module.exports = { User }