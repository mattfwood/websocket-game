import React, { Component } from 'react';
import styled from 'styled-components';

class Field extends Component {
  render() {
    return <div className={this.props.className}>{this.props.children}</div>;
  }
}

export default styled(Field)`
  position: relative;
  width: 300px;
  height: 300px;
  border: 5px solid #ccc;
  border-radius: 10px;
`;
