import React, { Component, ChangeEvent, FormEvent } from "react";
import "./MessageForm.css";

interface MessageFormProps {
  onAddMessage: (message: string) => Promise<void>; 
}

interface MessageFormState {
  newMessage: string;
}

class MessageForm extends Component<MessageFormProps, MessageFormState> {
  constructor(props: MessageFormProps) {
    super(props);
    this.state = {
      newMessage: "",
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMessage: event.target.value });
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { newMessage } = this.state;
    if (newMessage.trim() === "") {
      return;
    }

    try {
      await this.props.onAddMessage(newMessage);
      this.setState({ newMessage: "" });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { newMessage } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="chat-form">
        <input
          className="form-control"
          type="text"
          value={newMessage}
          onChange={this.handleInputChange}
        />
        <button type="submit" className="add-message-button">
          &#8680;
        </button>
      </form>
    );
  }
}

export default MessageForm;
