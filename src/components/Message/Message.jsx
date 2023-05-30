import React, { Component } from 'react';
import './Message.css';

class Message extends Component {
    messageRef = React.createRef();

    componentDidMount() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        if (this.messageRef.current) {
            this.messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    render() {
        const { message, currentUserId } = this.props;
        const isCurrentUserMessage = message.UserId === currentUserId;

        const messageClassName = isCurrentUserMessage ? 'current-user-message' : 'other-user-message';

        return (
        <div ref={this.messageRef} className={`chat-message ${messageClassName}`} id={message.id}>
            {message.newMessage}
        </div>
        );
    }
}

export default Message;
