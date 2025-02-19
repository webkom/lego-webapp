import { Button, ButtonGroup, Icon } from '@webkom/lego-bricks';
import { Trash2 } from 'lucide-react';
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
    <ButtonGroup>
      {selected ? (
        <Button onPress={toggleSelected}>Avbryt</Button>
      ) : (
        <Button danger onPress={toggleSelected}>
          <Icon iconNode={<Trash2 />} size={19} />
          Slett profilbildet
        </Button>
      )}
      {selected && (
        <Button danger onPress={handleOnClick}>
          Bekreft
        </Button>
      )}
    </ButtonGroup>
  );
};

export default RemovePicture;
