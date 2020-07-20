import React from "react";
import {message} from "antd";
//import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import "./index.css";

export default class Keep extends React.Component {
  state = {
    notes: [],
  };

  componentDidMount() {
    this.displayNotes();
  }

  displayNotes() {
    fetch('/keep/display-notes', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
      if(!res.message) {
        this.setState({notes: res});
      } else {
        message.error("Fail to display notes");
      }
    })
  }

  addNote = (newNote) => {
    fetch('/keep/add-note', {
      method: 'POST',
      body: JSON.stringify(newNote),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.message === 'Success') {
        message.success('Add note successfully!');
      } else {
        message.error('Fail to add note!');
      }
    })

    const { notes } = this.state;
    this.setState({
      notes: [...notes, newNote],
    });
  };

  deleteNote = (id) => {
    const { notes } = this.state;

    const params = {
      title: notes[id].title, 
      content: notes[id].content,
    }

    fetch('/keep/delete-note', {
      method: 'POST',
      body: JSON.stringify(params),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.message === 'Success') {
        message.success('Delete note successfully!');
      } else {
        message.error('Fail to delete note!');
      }
    })

    this.setState({
      notes: notes.filter((noteItem, index) => {
        return index !== id;
      }),
    });
  };

  render() {
    const { notes } = this.state;
    return (
      <div>
        <CreateArea onAdd={this.addNote} />
        {notes.map((noteItem, index) => {
          return (
            <Note
              key={index}
              id={index}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={this.deleteNote}
            />
          );
        })}
      </div>
    );
  }
}
