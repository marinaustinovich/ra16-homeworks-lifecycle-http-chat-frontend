import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import './Chat.css';
import MessageForm from '../MessageForm/MessageForm';
import Message from '../Message/Message';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastId: 0,
            messages: [],
            isLoading: true,
        };

        this.interval = null;
        this.currentUserId = localStorage.getItem('currentUserId') || nanoid();
        localStorage.setItem('currentUserId', this.currentUserId);
    }

    async componentDidMount() {
        await this.loadMessages(this.state.lastId);
        this.startPolling(); // Запуск периодического опроса сервера
    }

    componentWillUnmount() {
        this.stopPolling(); // Остановка периодического опроса сервера перед размонтированием компонента
    }

    startPolling = () => {
        this.interval = setInterval(() => {
            this.loadMessages(this.state.lastId);
        }, 30000); // Интервал опроса в миллисекундах (в данном случае 30 секунд)
    };

    stopPolling = () => {
        clearInterval(this.interval);
    };

    onAddMessage = async (newMessage) => {
        try {
            let newId = this.state.lastId;
            const formData = {
                id: newId++,
                newMessage,
                UserId: this.currentUserId,
            };

            const response = await fetch(process.env.REACT_APP_MESSAGES_URL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            if (response.status === 204) {
                this.setState({ lastId:  newId++});
                await this.loadMessages(this.state.lastId);
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    loadMessages = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_MESSAGES_URL_FROM}${id}`);
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            const messages = await response.json();

            this.setState(
                (prevState) => ({
                    messages: [...prevState.messages, ...messages],
                    isLoading: false,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { messages } = this.state;
        return (
        <div className="container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <Message key={index} message={message} currentUserId={this.currentUserId}/>
                ))}
            </div>
            <MessageForm onAddMessage={this.onAddMessage}></MessageForm>
        </div>
        );
    }
}

export default Chat;
