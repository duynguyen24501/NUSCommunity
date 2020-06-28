import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";

export default class Note extends React.Component {
  handleClick = () => {
    const { onDelete, id } = this.props;
    onDelete(id);
  };

  render() {
    const { title, content } = this.props;
    return (
      <div className="note">
        <h1>{title}</h1>
        <p>{content}</p>
        <button onClick={this.handleClick}>
          <DeleteIcon />
        </button>
      </div>
    );
  }
}
