import { HeroPage } from '@webkom/lego-bricks';
import { ComponentType } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import SubwaySurfers from '~/pages/christmas-calendar/games/SubwaySurfers';

const GameDisplay = () => {
  const { gameId } = usePageContext().routeParams;
  const games: Record<string, ComponentType> = {
    '3': SubwaySurfers,
  };
  const Game: ComponentType = games[gameId];

  return (
    <HeroPage title={`Slot ${gameId}`}>
      <Game />
    </HeroPage>
  );
};

export default GameDisplay;
