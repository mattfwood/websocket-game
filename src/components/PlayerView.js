import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Rock from '../rock.png';
import Paper from '../paper.png';
import Scissors from '../scissors.png';
import { Card, Button } from 'reactstrap';

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
    console.log(playerIndex);
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
          {JSON.stringify(gameState)}
          <div className="action-row">
            <img
              onClick={() => this.selectAction('rock')}
              className="action" src={Rock}
            />
            <img
              onClick={() => this.selectAction('paper')}
              className="action" src={Paper}
            />
            <img
              onClick={() => this.selectAction('scissors')}
              className="action" src={Scissors}
            />
          </div>
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

    // if both players are ready
    // post results to database and they'll be rendered
    return (
      <div>
        BOTH PLAYERS READY
        <Card>
          Player 1 {gameState.players[0].id === this.props.player ? '(You)' : ''}
          <br />
          Picked: {gameState.players[0].action}
        </Card>
        <Card>
          Player 2 {gameState.players[1].id}
          <br />
          Picked: {gameState.players[1].action}
        </Card>
        <Button color="primary" onClick={() => this.props.resetGame()}>
          Reset Game
        </Button>
      </div>
    );
  }
}

PlayerView.propTypes = {
  player: PropTypes.string,
  gameState: PropTypes.object
};

export default PlayerView;
