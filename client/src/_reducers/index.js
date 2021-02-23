import { combineReducers } from 'redux';
import user from './user_reducer';
//커멘트를 만든다면
//import comment from './comment_reducer';


const rootReducer = combineReducers({
    user
    //,comment
    //,comment
})

export default rootReducer;