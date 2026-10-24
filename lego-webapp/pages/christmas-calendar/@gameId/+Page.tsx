import { HeroPage } from '@webkom/lego-bricks';
import { usePageContext } from 'vike-react/usePageContext';

const GameDisplay = () => {
  const {gameId} = usePageContext().routeParams;
  return <HeroPage title="Spill">
    <p>Selected slot: {gameId}</p>
  </HeroPage>;
};

export default GameDisplay;
