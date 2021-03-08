import {
    SAVE_MESSAGE,
} from '../_actions/types';

//시작 state는 빈 array
//reducer에 빈 Array로 지정했기 때문
export default function (state = {messages:[]}, action) {
    switch (action.type) {
        case SAVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.concat(action.payload)
            }
        default:
            return state;
    }
}