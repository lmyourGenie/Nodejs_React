import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataToSubmit) {
    //이메일과 패스워드를 파라미터(dataToSubmit)을 통해 받음
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    return {
        // 이 type들을 _actions/types.js에 다~ 저장해서
        // _reducers/user_reducers.js의
        // case문으로 처리
        type: LOGIN_USER,
        payload: request
        //payload에 request를 저장
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}



export function auth() {

    const request = axios.get('/api/users/auth')
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}