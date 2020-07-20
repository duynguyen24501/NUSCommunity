import React from "react";
import { Result, Button } from "antd";

export default class Callback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  async componentDidMount() {
    this.getMessage();
  }

  getMessage() {
    fetch("/auth/signout", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          message: response.message,
        });
        console.log(this.state.message);
      });
  }

  render() {
    //const { history } = this.props;
    return (
      <Result
        status="success"
        title="Success!"
        subTitle="Thank you for your interest !"
        extra={[
          <Button key="home" type="primary" href="/login">
            Go to Login
          </Button>,
          // <Button
          //   key="back"
          //   onClick={() => {
          //     history.goBack();
          //   }}
          // >
          //   Go Back
          // </Button>,
        ]}
      />
    );
  }
}
