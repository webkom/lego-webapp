import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import AttendanceModal from './AttendanceModal';

export default function withModal(WrappedComponent) {
  return class extends Component {
    state = { modalVisible: false, selectedTab: 0 };

    toggleModal = (key = 0) => {
      this.setState(state => ({
        modalVisible: !state.modalVisible,
        selectedTab: key
      }));
    };

    toggleTab = (key = 0) => {
      this.setState({
        selectedTab: key
      });
    };

    render() {
      return (
        <div>
          <WrappedComponent {...this.props} toggleModal={this.toggleModal} />
          <Modal
            show={this.state.modalVisible}
            onHide={() => this.toggleModal(0)}
          >
            <AttendanceModal
              selectedPool={this.state.selectedTab}
              togglePool={this.toggleTab}
              pools={this.props.pools}
            />
          </Modal>
        </div>
      );
    }
  };
}

const ChildrenWithProps = ({ children, ...restProps }) => (
  <div>
    {React.Children.map(children, child =>
      React.cloneElement(child, { ...restProps })
    )}
  </div>
);
export const ModalParentComponent = withModal(ChildrenWithProps);
