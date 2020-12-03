import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { saveMessage } from '../_actions/message_actions';
import { List, Icon, Avatar } from 'antd';
import Message from './Sections/MessageClone'
import Card from './Sections/CardClone'

function Chatbot() {
    const dispatch = useDispatch();
    const messagesFromRedux = useSelector(state => state.message.messages)

    useEffect(() => {
        eventQuery('WelcomeToMyWebsite')
    },[])  

    const textQuery = async (text) => {

        //우선은 받은 메세지를 화면에 나타내어 처리합니다.
        let conversation = {
            who: 'user',
            content: {
                //아래와 같은 형태를 한 이유는 dialogflow에서 보내는 res와 형태를 일치하기 위함입니다.
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))
        // console.log("내가 보낸거",conversation)
        const textQueryVariables = {
            text
        }

        //그 다음은 메세지를 전달하고 챗봇을 통해 돌려받은 답변을 나타냅니다.
        try {
        // textQuery Route에 req를 보냄.
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)

            for (let content of response.data.fulfillmentMessages) {
                conversation = {
                    who: 'bot',
                    content: content
                }
                // console.log(conversation)
                dispatch(saveMessage(conversation))
            }
        } catch (err) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "잘못된 메세지입니다. 다시 작성해주세요."
                    }
                }
            }
            // console.log(conversation)
            dispatch(saveMessage(conversation))
        }
    }

    
    const eventQuery = async (event) => {

        //이벤트쿼리에서는 챗봇으로부터 받은 메세지만 나타내면 됩니다.
        const eventQueryVariables = {
            event
        }

        try {
        // textQuery Route에 req를 보냄.
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',
                    content: content
                }
                // console.log(conversation)
                dispatch(saveMessage(conversation))
            }

        } catch (err) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "잘못된 메세지입니다. 다시 작성해주세요."
                    }
                }
            }
            // conversations.push(conversation)
            dispatch(saveMessage(conversation))
            // console.log(conversation)
        }
    }

    const keyPressHendler = (e) => {
        if(e.key === "Enter") {
            if(!e.target.value) {
                return alert('메세지를 입력해주세요')
            }
            //request 로 메세지 전달.
            textQuery(e.target.value)
            e.target.value=""
        }
    }

    const renderCards = (cards) => {
        return cards.map((card, i) => {
            return <Card key={i} cardInfo={card.structValue}/>
        })
    }

    const renderOneMessage = (message, i) => {
        console.log('message', message)

        //여기서 조건에 따른 분기가 필요합니다.
        //메세지를 위한 UI , 카드를 위한 UI
        if(message.content && message.content.text && message.content.text.text ) {
            return <Message key={i} who={message.who} text={message.content.text.text} />
        } else if(message.content && message.content.payload.fields.card) {
            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />
            return <div>
            <List.Item style={{padding: '1rem'}}>
                <List.Item.Meta
                    avatar={<Avatar icon={AvatarSrc} />}
                    title={message.who}
                    description={renderCards(message.content.payload.fields.card.listValue.values)}
                />
            </List.Item>
            </div>
        }

        // <Message key={i} who={message.who} text={message.content.text.text} />
    
    }

    const renderMessage = (returnedMessages) => {

        if(returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }

    return (
        <div style={{height: 700, width: 700, border: '3px solid black', borderRadius: '7px'}}>
            <div style={{height: 644, width: '100%', overflow: 'auto'}}>

            {renderMessage(messagesFromRedux)}

            </div>

            <input
                style={{margin: 0, width: '100%', height: 50, borderRadius: '4px', padding: '5px', fontSize: ''}}
                placeholder="여기에 입력해주세요..."
                onKeyPress={keyPressHendler}
                type="text"
            />
        </div>
    )
}

export default Chatbot;