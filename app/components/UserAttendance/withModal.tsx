import { Children, cloneElement, Component } from 'react';
import Modal from 'app/components/Modal';
import AttendanceModal from './AttendanceModal';
import type { Pool } from './AttendanceModal';
import type { ComponentType, ReactElement } from 'react';

type State = {
  modalVisible: boolean;
  selectedTab: number;
};

type WithModalProps = {
  pools: Pool[];
  title?: string;
  isMeeting?: boolean;
};

export default function withModal<Props extends WithModalProps>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  return class WithModal extends Component<Props, State> {
    static displayName = `WithModal(${displayName})`;
    state = {
      modalVisible: false,
      selectedTab: 0,
    };
    toggleModal = (key = 0) => {
      this.setState((state) => ({
        modalVisible: !state.modalVisible,
        selectedTab: key,
      }));
    };
    toggleTab = (key = 0) => {
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
              title={this.props.title}
              selectedPool={this.state.selectedTab}
              togglePool={this.toggleTab}
              pools={this.props.pools}
              isMeeting={this.props.isMeeting}
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
}: WithModalProps & {
  children: ReactElement;
}) => (
  <div>
    {Children.map(children, (child) => cloneElement(child, { ...restProps }))}
  </div>
);

export const ModalParentComponent = withModal(ChildrenWithProps);
