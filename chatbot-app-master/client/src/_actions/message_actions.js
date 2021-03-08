import {
    SAVE_MESSAGE, // 타입을 정의해야함 types.js에!
} from './types';

export function saveMessage(dataToSubmit) {
   
    return {
        type: SAVE_MESSAGE,
        payload: dataToSubmit
    }
}
