import React, { Component } from "react";
import { nanoid } from "nanoid";
import "./Chat.css";
import MessageForm from "../MessageForm/MessageForm";
import Message, { MessageData } from "../Message/Message";

const apiUrlMessages = process.env.REACT_APP_MESSAGES_URL;
const apiUrlMessagesFrom = process.env.REACT_APP_MESSAGES_URL_FROM;

interface ChatState {
  lastId: number;
  messages: MessageData[];
  isLoading: boolean;
}

interface ChatProps {}

class Chat extends Component<ChatProps, ChatState> {
  interval: number | undefined;
  currentUserId: string;

  constructor(props: ChatProps) {
    super(props);
    this.state = {
      lastId: 0,
      messages: [],
      isLoading: true,
    };

    this.interval = undefined;
    this.currentUserId = localStorage.getItem("currentUserId") || nanoid();
    localStorage.setItem("currentUserId", this.currentUserId);
  }

  async componentDidMount() {
    await this.loadMessages(this.state.lastId);
    this.startPolling();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  startPolling = () => {
    this.interval = window.setInterval(() => {
      this.loadMessages(this.state.lastId);
    }, 100000); 
  };
  
  stopPolling = () => {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  };

  onAddMessage = async (newMessage: string): Promise<void> => {
    try {
      let newId = this.state.lastId;
      const formData = {
        id: newId++,
        newMessage,
        userId: this.currentUserId,
      };

      if (!apiUrlMessages) {
        console.error("no url");
        return;
      }

      const response = await fetch(apiUrlMessages, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }
      if (response.status === 204) {
        this.setState({ lastId: newId++ });
        await this.loadMessages(this.state.lastId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadMessages = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${apiUrlMessagesFrom}${id}`);
      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }
      const messages = await response.json();
console.log(messages)
      this.setState(() => ({
        messages: [ ...messages],
        isLoading: false,
      }));
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
            <Message
              key={index}
              message={message}
              currentUserId={this.currentUserId}
            />
          ))}
        </div>
        <MessageForm onAddMessage={this.onAddMessage}></MessageForm>
      </div>
    );
  }
}

export default Chat;
