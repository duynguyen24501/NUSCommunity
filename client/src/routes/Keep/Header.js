import React from "react";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <h1>
          <EmojiObjectsIcon />
          Keep
        </h1>
      </header>
    );
  }
}
