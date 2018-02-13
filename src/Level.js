import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Level extends Component {

  render() {
    return (
      <div className="level-container">
        {this.props.children}
      </div>
    );
  }
}

Level.propTypes = {
  children: PropTypes.node
};

export default Level;
