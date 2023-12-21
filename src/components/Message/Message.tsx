import React, { Component, RefObject } from "react";
import "./Message.css";

export interface MessageData {
    id: string; // предполагается, что id сообщения - это строка
    newMessage: string; // текст сообщения
    userId: string; //  - это строка
}

interface MessageProps {
  message: MessageData
  currentUserId: string; // текущий UserId
}

class Message extends Component<MessageProps> {
  messageRef: RefObject<HTMLDivElement>;

  constructor(props: MessageProps) {
    super(props);
    this.messageRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.messageRef.current) {
      this.messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  render() {
    const { message, currentUserId } = this.props;
    const isCurrentUserMessage = message.userId === currentUserId;

    const messageClassName = isCurrentUserMessage
      ? "current-user-message"
      : "other-user-message";

    return (
      <div
        ref={this.messageRef}
        className={`chat-message ${messageClassName}`}
        id={message.id}
      >
        {message.newMessage}
      </div>
    );
  }
}

export default Message;
