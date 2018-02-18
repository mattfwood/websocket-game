import React, { Component } from 'react';
import PropTypes from 'prop-types';

import rock from '../rock.png';
import paper from '../paper.png';
import scissors from '../scissors.png';
import { Alert, Card, Button, Row, Col, CardHeader, CardBody } from 'reactstrap';

const icon = {
  rock,
  paper,
  scissors
};

class PlayerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: '',
      playerIndex: null
    };
  }

  selectAction = (action) => {
    this.setState({ action: action });

    this.props.playerReady(this.state.playerIndex);
  }

  componentDidMount() {
    // const playerIndex = this.props.gameState.players.findIndex(player => player.id === this.state.currentPlayer);
    // console.log(playerIndex);
    // playerIndex: this.props.gameState.players.findIndex(player => player.id === this.state.currentPlayer)
    const playerIndex = this.props.gameState.players.findIndex(player => player.id === this.props.player);
    this.setState({ playerIndex });
  }

  componentDidUpdate() {
    // const playerIndex = this.props.gameState.players.findIndex(player => player.id === this.props.player);
    // console.log(playerIndex);
  }

  componentWillReceiveProps(nextProps) {
    const { playerIndex, action } = this.state;
    const { gameState, player } = nextProps;
    const bothPlayersReady = (gameState) => {
      const playerStates = gameState.players.map(player => player.status);
      if (playerStates.includes('selecting')) {
        return false;
      }
      return true;
    };

    if (bothPlayersReady(gameState)) {
      this.props.playerAction(playerIndex, action);
    }
  }

  render() {
    const { playerIndex, action } = this.state;
    const { gameState, player } = this.props;
    const bothPlayersReady = (gameState) => {
      const playerStates = gameState.players.map(player => player.status);
      if (playerStates.includes('selecting')) {
        return false;
      }
      return true;
    };

    if (bothPlayersReady(gameState) === false) {
      return (
        <div>
          Your Player ID: {player}
          <Row>
            <Col className="d-flex justify-content-center">
              <img
                onClick={() => this.selectAction('rock')}
                className="action" src={icon.rock}
              />
            </Col>
            <Col className="d-flex justify-content-center">
              <img
                onClick={() => this.selectAction('paper')}
                className="action" src={icon.paper}
              />
            </Col>
            <Col className="d-flex justify-content-center">
              <img
                onClick={() => this.selectAction('scissors')}
                className="action" src={icon.scissors}
              />
            </Col>
          </Row>
          {
            this.state.action && (
              <div className="text-center mt-5">
                <h4>
                  You picked: {this.state.action}
                </h4>
                Waiting for other player to select...
              </div>
            )
          }
        </div>
      );
    }

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

    // if both players are ready
    // post results to database and they'll be rendered
    return (
      <div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                Player 1 {playerOne.id === this.props.player ? '(You)' : ''}
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
                Player 2 {playerTwo.id === this.props.player ? '(You)' : ''}
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
        <Row>
          <Col className="d-flex justify-content-center mt-5">
            <Button color="primary" onClick={() => this.props.resetGame()}>
              Reset Game
          </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

PlayerView.propTypes = {
  player: PropTypes.string,
  gameState: PropTypes.object
};

export default PlayerView;
