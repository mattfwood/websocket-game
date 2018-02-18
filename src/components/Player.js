import React from 'react';
import PropTypes from 'prop-types';

function Player(props) {
  const { player, index } = props;
  return (
    <div
      className={`grid-square player-square player-${index}`}
      style={{
        left: `${player.position.x * 50}px`,
        top: `${player.position.y * 50}px`
      }}
    />
  );
}

Player.propTypes = {
  playerIndex: PropTypes.number,
  position: PropTypes.object,
  id: PropTypes.number
};

export default Player;
