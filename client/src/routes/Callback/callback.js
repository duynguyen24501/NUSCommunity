import React from 'react'
import { Link } from "react-router-dom";
import "./callback.css"

export default class Callback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message:''
    }
  }

  async componentDidMount() {
    this.getMessage()
  }

  getMessage() {
    fetch('/auth/signout', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      this.setState({
        message: response.message
      })
      console.log(this.state.message);
    })
  }

  render() {
    return (     
        <form>
          <div>

            <div>
              <h1>{this.state.message}</h1>
            </div>

            <div>
              <p><Link to="/"><a>Go to home</a></Link></p>
            </div>

          </div>
        </form> 
    )
  }
}
