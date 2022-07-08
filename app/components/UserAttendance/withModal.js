// @flow

import type { ComponentType, Element } from 'react';
import { Children, cloneElement, Component } from 'react';

import Modal from 'app/components/Modal';
import AttendanceModal from './AttendanceModal';

type State = {
  modalVisible: boolean,
  selectedTab: number,
};

export default function withModal<Props: *>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  return class WithModal extends Component<Props, State> {
    static displayName = `WithModal(${displayName})`;

    state = { modalVisible: false, selectedTab: 0 };

    toggleModal = (key: number = 0) => {
      this.setState((state) => ({
        modalVisible: !state.modalVisible,
        selectedTab: key,
      }));
    };

    toggleTab = (key: number = 0) => {
      this.setState({
        selectedTab: key,
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
              allRegistrations={this.props.registrations}
            />
          </Modal>
        </div>
      );
    }
  };
}

const ChildrenWithProps = ({
  children,
  ...restProps
}: {
  children: Element<*>,
}) => (
  <div>
    {Children.map(children, (child) => cloneElement(child, { ...restProps }))}
  </div>
);

//$FlowFixMe
export const ModalParentComponent = withModal(ChildrenWithProps);
