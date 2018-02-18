import React, { Component } from 'react';
import PropTypes from 'prop-types';

function Player(props) {
  const { player, id } = props;
  return (
    <div
      className={`grid-square player-square player-${props.index}`}
      style={{
        left: `${player.position.x * 50}px`,
        top: `${player.position.y * 50}px`
      }}
    />
  );
}

Player.propTypes = {
  playerIndex: PropTypes.number,
  position: PropTypes.array,
  id: PropTypes.number
};

export default Player;
