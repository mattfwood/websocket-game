import React, { Component } from 'react';
import { Alert, Card, Button, Row, Col, CardHeader, CardBody } from 'reactstrap';

function Results(props) {
  const { gameState, currentPlayer, icon } = props;
  const playerOne = gameState.players[0];
  const playerTwo = gameState.players[1];

  const system = {
    rock: 0,
    paper: 1,
    scissors: 2
  };

  const winnerMatrix = [
    'Draw',
    'Player Two',
    'Player One',
    'Player One',
    'Draw',
    'Player Two',
    'Player Two',
    'Player One',
    'Draw'
  ];

  const winner = winnerMatrix[system[playerOne.action] * 3 + system[playerTwo.action]];

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Player 1 {playerOne.id === currentPlayer ? '(You)' : ''}
            </CardHeader>
            <CardBody className="d-flex flex-column align-items-center">
              <img
                className="action" src={icon[playerOne.action]}
              />
              <div>
                {playerOne.action}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardHeader>
              Player 2 {playerTwo.id === currentPlayer ? '(You)' : ''}
            </CardHeader>
            <CardBody className="d-flex flex-column align-items-center">
              <img
                className="action" src={icon[playerTwo.action]}
              />
              <div>
                {playerTwo.action}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Alert color="primary">
            {winner !== 'Draw' ? `${winner} Wins!` : 'Draw!'}
          </Alert>
        </Col>
      </Row>
      {props.children}
    </div>
  );
}

export default Results;
