import React, { Component } from 'react';

export type Props = {
  url: String
};

export default class EmbedComponent extends Component {

  props: Props;

  state = {
    loading: true,
    html: null
  }

  componentDidMount() {
    this.getEmbed();
    window.iframely.load();
  }

  getEmbed = () => {
    console.log(this.props.blockProps.url);
    fetch(`http://iframe.ly/api/iframely?api_key=47e7eb87a954377b035433&iframe=1&iframe=true&omit_script=true&url=${this.props.blockProps.url}`)
      .then((response) => response.json()
      .then((body) => {
        this.setState({
          loading: false,
          html: body.html
        });
      }));
  }

  render() {
    return (
      <div className='block-embed'>
        {this.state.loading ?
          <h1>loading</h1> : <div dangerouslySetInnerHTML={{ __html: this.state.html }} />}
      </div>
    );
  }
}
