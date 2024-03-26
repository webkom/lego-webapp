import { Button, Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { removePicture } from 'app/actions/UserActions';
import { useAppDispatch } from 'app/store/hooks';

type Props = {
  username: string;
};

const RemovePicture = (props: Props) => {
  const [selected, setSelected] = useState(false);

  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    if (selected)
      dispatch(removePicture(props.username)).then(() => {
        setSelected(false);
      });
  };

  const toggleSelected = () => setSelected(!selected);

  return (
    <div>
      {selected ? (
        <Button onClick={toggleSelected}>Avbryt</Button>
      ) : (
        <Button danger onClick={toggleSelected}>
          <Icon name="trash" size={19} />
          Slett profilbildet
        </Button>
      )}
      {selected && (
        <Button danger onClick={handleOnClick}>
          Bekreft
        </Button>
      )}
    </div>
  );
};

export default RemovePicture;
