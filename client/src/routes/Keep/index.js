import React from "react";
// import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import "./index.css";

export default class Keep extends React.Component {
  state = {
    notes: [],
  };

  addNote = (newNote) => {
    const { notes } = this.state;
    this.setState({
      notes: [...notes, newNote],
    });
  };

  deleteNote = (id) => {
    const { notes } = this.state;
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
