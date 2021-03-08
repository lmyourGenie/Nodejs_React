import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import { List, Icon, Avatar } from 'antd';
import Card from "./Sections/Card";
function Chatbot() {
    const dispatch = useDispatch();
    const messagesFromRedux = useSelector(state => state.message.messages)

    useEffect(() => {

        eventQuery('welcomeToMyWebsite')

    }, [])


    //뭔가 입력하고 엔터를 누르면
    //textQuery Function 실행
    //이 conversation데이터를 리덕스 스토어에 넣음


    //TextQuery Function 만들기
    const textQuery = async (text) => {

        //  First  Need to  take care of the message I sent    
        let conversation = {
            /*
            conversation이라는 이름의 object 변수 생성
            그 안에 누가 메시지를 보냈는지 넣음
            */
            who: 'user', //user : 우리 자신
            content: { //content : 우리가 입력한 것
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))

        // We need to take care of the message Chatbot sent 
        const textQueryVariables = {
            text
        }
        try {
            //I will send request to the textQuery ROUTE 
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)

            for (let content of response.data.fulfillmentMessages) {
                //하나의 입력이 들어와도 필요에 따라 여러개의 출력을 할 수 있도록 함

                conversation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }
            //우리가 입력한 데이터 뿐만 아니라
            //봇이 보낸 데이터도 저장


        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
                //에러가 났을 때도 저장
            }

            dispatch(saveMessage(conversation))


        }

    }


    //EventQuery Function 만들기
    const eventQuery = async (event) => {

        // We need to take care of the message Chatbot sent 
        const eventQueryVariables = {
            event //텍스트쿼리와 달리 event라고 하는 것을 확인하자
        }
        try {
            //I will send request to the textQuery ROUTE 
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            for (let content of response.data.fulfillmentMessages) {
                //하나의 입력이 들어와도 필요에 따라 여러개의 출력을 할 수 있도록 함

                let conversation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }


        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }

    }


    const keyPressHanlder = (e) => {
        if (e.key === "Enter") {
            //엔터를 친다면

            if (!e.target.value) {
                return alert('you need to type somthing first')
                //아무것도 입력하지 않고 엔터키를 누를 경우
            }

            //we will send request to text query route 
            textQuery(e.target.value) //무언가를 입력하고 엔터키를 누른 경우


            e.target.value = "";
        }
    }

    const renderCards = (cards) => {
        return cards.map((card,i) => <Card key={i} cardInfo={card.structValue} />)
    }

    
    //renderOneMessage를 정의함
    const renderOneMessage = (message, i) => {
        console.log('message', message)

        // we need to give some condition here to separate message kinds 

        // template for normal text 
        // 저장된 걸 보고 조건을 지정함
        if (message.content && message.content.text && message.content.text.text) { //이런 형식이면 텍스트 메세지인 것을 알 수 있다
            return <Message key={i} who={message.who} text={message.content.text.text} />
        } else if (message.content && message.content.payload.fields.card) { //반면 이런 형식이라면 카드 메세지인 것을 알 수 있다

            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />

            return <div>
                <List.Item style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        description={renderCards(message.content.payload.fields.card.listValue.values)}
                        //세 개의 카드 정보가 한꺼번에 들어오므로 map으로 정리하는데 그 코드는 138
                    />
                </List.Item>
            </div>
        }






        // template for card message 

    }


    const renderMessage = (returnedMessages) => {

        if (returnedMessages) {
            //map메소드를 이용
            //하나하나의 데이터들을 다 처리해줘야 되기 때문
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }
    //helper Method 생성

    return (
        // useSelector를 사용해서
        // 리덕스 안에 들어 있는 데이터들을 넣어주어야함
        //(messagesFromRedux 변수로 저장된 데이터를 가져옴)
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>


                {renderMessage(messagesFromRedux)}


            </div>
            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHanlder}
                type="text"
            />

        </div>
    )
}

export default Chatbot;
