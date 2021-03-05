const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
    //Model에 필요한 다섯 가지 요소를 모델에 넣음
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    movieId: {
        type: String
    },
    movieTitle: {
        type: String
    },
    moviePost: {
        type: String
    },
    movieRunTime: {
        type: String
    }
}, { timestamps: true })
//timestamps는 생성된 시간 등을 자동으로 처리해줌

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }