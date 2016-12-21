import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updatePicture } from 'app/actions/UserActions';

class Upload extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const file = this.fileField.files[0];
    this.props.updatePicture({ picture: file });
  }

  render() {
    return <div>
      <form onSubmit={this.handleSubmit}>
        <input type='file' name='file' ref={(ref) => this.fileField = ref }  />
        <button type='submit'>Post denna filen</button>
      </form>
    </div>;
  }

}

const mapDispatchToProps = {
  updatePicture
};

export default connect(null, mapDispatchToProps)(Upload);
