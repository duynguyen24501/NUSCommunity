import React from 'react'
import Link from 'next/link'
//import Layout from '../components/layout'

export default class extends React.Component {

  static async getInitialProps({req, query}) {

    let props = {
      message: ''
    }

    props.message = query.message || 'An unknown error occured!'
    
    return props
  }

  render() {
    return (
      <Layout {...this.props}>
        <div>
          <p>{this.props.message}</p>
          <p><Link href="/"><a>Go to home</a></Link></p>
        </div>
      </Layout>
    )
  }
}