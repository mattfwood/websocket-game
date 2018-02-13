import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Player extends Component {
  updatePosition = (event) => {
    console.log(this);
    // this.props.movePlayer('left');
  }

  render() {
    const { position, id } = this.props;
    return (
      <div className="player" style={{ top: position.top, left: position.left }} onKeyDown={this.updatePosition}/>
    );
  }
}

Player.propTypes = {
  position: PropTypes.object,
  id: PropTypes.number
};

export default Player;
