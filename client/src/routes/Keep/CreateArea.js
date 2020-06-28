import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

export default class CreateArea extends React.Component {
  state = {
    isExpanded: false,
    note: {
      title: "",
      content: "",
    },
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    const { note } = this.state;
    this.setState({
      note: {
        ...note,
        [name]: value,
      },
    });
  };

  submitNote = (event) => {
    const { note } = this.state;
    const { onAdd } = this.props;
    onAdd(note);
    this.setState({
      note: {
        title: "",
        content: "",
      },
    });
    event.preventDefault();
  };

  expand = () => {
    this.setState({
      isExpanded: true,
    });
  };

  render() {
    const { isExpanded, note } = this.state;
    return (
      <div>
        <form className="create-note">
          {isExpanded && (
            <input
              name="title"
              onChange={this.handleChange}
              value={note.title}
              placeholder="Title"
            />
          )}
          <textarea
            name="content"
            onClick={this.expand}
            onChange={this.handleChange}
            value={note.content}
            placeholder="Take a note..."
            rows={isExpanded ? 3 : 1}
          />
          <Zoom in={isExpanded}>
            <Fab onClick={this.submitNote}>
              <AddIcon />
            </Fab>
          </Zoom>
        </form>
      </div>
    );
  }
}
