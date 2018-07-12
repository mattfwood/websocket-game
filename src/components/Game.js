import React, { Component } from 'react';
import Player from './Player';
import {
  Alert,
  Col,
  Row,
  Button,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import base from '../base';
import clipboard from '../clippy.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Field from './Field';
import Ball from './Ball';

const FontAwesome = require('react-fontawesome');

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      gameState: {
        id: 'game',
        status: 'lobby',
        turn: 0,
        players: [],
      },
    };
  }

  componentWillMount() {
    this.ref = base.syncState(`gameState/${this.props.match.params.id}`, {
      context: this,
      state: 'gameState',
    });
  }

  componentDidMount() {
    const { gameState } = this.state;
    const { currentPlayer } = this.props;
    window.addEventListener('deviceorientation', this.handleOrientation);
    // console.log('CURRENT PLAYER:' + currentPlayer)
    // const gameId = this.props.match.params.id;

    // gameState.players.forEach(player => {
    //   const playerIndex = gameState.players.findIndex(player => player.id === currentPlayer);

    //   // if player doesn't exist in current game, add them
    //   if (playerIndex === -1) {
    //     alert('new player found');
    //     gameState.players.push({ id: currentPlayer });
    //     this.setState({ gameState });
    //   }
    // });

    // if (games.length > 0) {
    //   games = games.map(game => {
    //     if (game.id === gameId) {
    //       const playerIndex = game.players.findIndex(player => player.id === currentPlayer);
    //       // if player isn't already in game, add them
    //       const { gameState } = this.state;
    //       // if there are already players in the game, set state to a new array with
    //         if (playerIndex === -1) {
    //           gameState.players.push({ id: currentPlayer });
    //           this.setState({ gameState });
    //         } else {
    //           console.log('player already in game');
    //         }
    //         // if the gameState players array is empty
    //       return game;
    //     }
    //     return game;
    //   });
    //   console.log(games);
    //   this.props.updateGames(games);
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('COMPONENT UPDATED', nextProps, nextState);

    // if (nextState.gameState.players.length)
    // debugger

    const { gameState } = nextState;
    const { currentPlayer } = nextProps;

    gameState.players.forEach(player => {
      const playerIndex = gameState.players.findIndex(
        player => player.id === currentPlayer
      );

      // if player doesn't exist in current game, add them
      if (playerIndex === -1) {
        // alert('new player found');
        console.log('new player found');
        gameState.players.push({ id: currentPlayer });
        this.setState({ gameState });
      }
    });

    return true;
  }

  handleOrientation = e => {
    if (this.state.gameState.status === 'active' || this.state.gameState.status === 'ended') {

      const playerId = window.localStorage.getItem('websocket-game-id');
      const maxX = 300 - 20;
      const maxY = 300 - 20;
      const { players } = this.state.gameState;

      const currentPlayerIndex = players.findIndex(player => player.id === playerId);

      if (currentPlayerIndex !== -1) {
        // get current players position
        const { position } = players[currentPlayerIndex];
        const { y, x } = position;

        const newPosition = {
          y: y + (e.gamma / 10),
          x: x + (e.beta / 10),
        };

        if (
          newPosition.y > maxY ||
          newPosition.y < 0 ||
          newPosition.x > maxX ||
          newPosition.x < 0
        ) {
          // do nothing
        } else {
          players[currentPlayerIndex].position = newPosition;

          this.setState({
            gameState: {
              players
            },
          });
        }

        console.log({ playerId, e });
      }
    }

  };

  startGame = (playerOne, playerTwo) => {
    const gameId = this.props.match.params.id;

    if (playerOne && playerTwo && gameId) {
      base.post(`gameState/${gameId}`, {
        data: {
          id: gameId,
          status: 'active',
          turn: 0,
          players: [
            {
              id: playerOne,
              position: {
                x: 150,
                y: 150,
              },
            },
            {
              id: playerTwo,
              position: {
                x: 150,
                y: 150,
              },
            },
          ],
        },
        then(err) {
          if (!err) {
            // console.log('game started');
          }
        },
      });
    } else {
      console.log('You need two players to start');
      alert('Two players required');
    }
  };

  playerReady = playerIndex => {
    const { gameState } = this.state;
    gameState.players[playerIndex].status = 'ready';
    this.setState({ gameState });
  };

  playerAction = (playerIndex, action) => {
    // console.log(playerIndex, action);
    const { gameState } = this.state;
    gameState.players[playerIndex].action = action;
    this.setState({ gameState });
  };

  resetGame = () => {
    let { gameState } = this.state;

    gameState.players[0].position = {
      x: 2,
      y: 0,
    };

    gameState.players[1].position = {
      x: 2,
      y: 4,
    };

    // gameState.players[2].position = {
    //   x: 2,
    //   y: 4
    // }

    gameState.status = 'lobby';

    this.setState({ gameState });
  };

  selectAction = (playerIndex, action) => {
    const { gameState } = this.state;

    gameState.players[playerIndex].action = action;
    gameState.players[playerIndex].status = 'ready';
    this.setState({ gameState });
  };

  checkWinner = gameState => {
    const { players } = gameState;
    if (
      players[0].position.x > 4 ||
      players[0].position.y > 4 ||
      players[0].position.x < 0 ||
      players[0].position.y < 0
    ) {
      alert('Player Two Wins');
      gameState.status = 'ended';
      this.setState({ gameState });
    } else if (
      players[1].position.x > 4 ||
      players[1].position.y > 4 ||
      players[1].position.x < 0 ||
      players[1].position.y < 0
    ) {
      alert('Player One Wins');
      gameState.status = 'ended';
      this.setState({ gameState });
    } else {
      // console.log('No Winner Decided');
    }
  };

  checkCollision = (gameState, movingPlayer, direction) => {
    const { players } = gameState;
    const otherPlayer = movingPlayer === 0 ? 1 : 0;
    if (
      players[0].position.x === players[1].position.x &&
      players[0].position.y === players[1].position.y
    ) {
      // console.log('COLLISION DETECTED');
      // move both players in specified direction
      switch (direction) {
        case 'left':
          // decrease player's X position by 1
          // gameState.players[movingPlayer].position.x -= 1;
          gameState.players[otherPlayer].position.x -= 1;
          break;

        case 'right':
          // increase player's X position by 1
          // gameState.players[movingPlayer].position.x += 1;
          gameState.players[otherPlayer].position.x += 1;
          break;

        case 'up':
          // increase player's Y position by 1
          // gameState.players[movingPlayer].position.y -= 1;
          gameState.players[otherPlayer].position.y -= 1;
          break;

        case 'down':
          // decrease player's X position by 1
          // gameState.players[movingPlayer].position.y += 1;
          gameState.players[otherPlayer].position.y += 1;
          break;

        default:
        // console.log('error moving character');
      }

      this.setState({ gameState });
    } else {
      // if no collision, set game state normall
      this.setState({ gameState });
    }

    this.checkWinner(gameState);
  };

  movePlayer = (direction, index) => {
    const { gameState } = this.state;
    switch (direction) {
      case 'left':
        // decrease player's X position by 1
        gameState.players[index].position.x -= 1;
        break;

      case 'right':
        // increase player's X position by 1
        gameState.players[index].position.x += 1;
        break;

      case 'up':
        // increase player's Y position by 1
        gameState.players[index].position.y -= 1;
        break;

      case 'down':
        // decrease player's X position by 1
        gameState.players[index].position.y += 1;
        break;

      default:
      // console.log('player passed');
    }

    gameState.turn = gameState.turn === 0 ? 1 : 0;

    this.checkCollision(gameState, index, direction);

    // this.setState({ gameState });
  };

  render() {
    console.log(this.state);
    const { gameState } = this.state;
    const { status } = gameState;
    const { currentPlayer } = this.props;
    // const gameId = this.props.match.params.id;

    if (status === 'lobby') {
      return (
        <Row>
          <Col>
            <Card>
              <CardHeader className="copy-link-header">
                <CopyToClipboard
                  text={`${window.location.origin}/game/${gameState.id}`}
                >
                  <div>
                    {gameState.id}
                    <img
                      src={clipboard}
                      className="clipboard-icon"
                      alt="Copy to Clipboard"
                    />
                  </div>
                </CopyToClipboard>
              </CardHeader>
              <ListGroup>
                {gameState &&
                  gameState.players.map(player => {
                    return <ListGroupItem>{player.id}</ListGroupItem>;
                  })}
              </ListGroup>
            </Card>
            <Button
              color="primary"
              className="mt-3"
              onClick={() =>
                this.startGame(gameState.players[0].id, gameState.players[1].id)
              }
              disabled={gameState.players.length < 2}
              block
            >
              Start Game
            </Button>
          </Col>
        </Row>
      );
    }

    if (status === 'active' || status === 'ended') {
      return (
        <div className="view">
          <Card>
            <CardBody>
              <Field>
                <div>Player</div>
              </Field>
              {gameState.players.map((player, index) => (
                <Ball top={player.position.x} left={player.position.y} />
              ))}
              {/* {status === 'ended' && (
                <Button color="primary" onClick={() => this.resetGame()}>
                  Reset Game
                </Button>
              )} */}
            </CardBody>
          </Card>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>Game Not Found</CardHeader>
      </Card>
    );
  }
}

export default Game;
