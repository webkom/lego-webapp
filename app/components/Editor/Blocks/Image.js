import React, { Component } from 'react';

export type Props = {
  url: String
};

export default class ImageBlock extends Component {

  props: Props;

  componentDidMount() {
    console.log(this);
    this.uploadImage();
  }

  uploadImage = () => {
    console.log(this.props.blockProps);
    this.props.blockProps.uploadFile(this.props.blockProps.image)
      .then((action) => {
        console.log(action);
      });
  }

  render() {
    return (
      <div className='image'>
        <img src={window.URL.createObjectURL(this.props.blockProps.image)}/>
      </div>
    );
  }
}
