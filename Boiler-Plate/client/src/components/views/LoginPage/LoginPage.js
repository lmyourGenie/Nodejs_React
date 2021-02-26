import React, { useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();

    //이메일과 패스워드를 위한 state을 생성
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    //state을 바꾸면 아래의 52번째줄 value가 바뀌는 순서

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
        //state 바꿀 수 있도록 함
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        //페이지의 refresh를 막기 위해

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                    // 로그인 성공하면 페이지를 변경
                } else {
                    alert('Error')
                }
            })
    }


    //확인 버튼 제출을 위해 onSubmit 이벤트를 생성
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)