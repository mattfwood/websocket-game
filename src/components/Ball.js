import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Ball = ({ top, left, className }) => {
  console.log({ top, left, className });
  return <div className={className} style={{ top, left }} />;
};

Ball.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
};

export default styled(Ball)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: green;
  border-radius: 100%;
`;
