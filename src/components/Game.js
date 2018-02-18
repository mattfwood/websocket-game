import React, { Component } from 'react';
import Player from './Player';
import { Col, Row, Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import PlayerView from './PlayerView';
import Results from './Results';
import base from '../base';
import rock from '../rock.png';
import paper from '../paper.png';
import scissors from '../scissors.png';
import clipboard from '../clippy.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const icon = {
  rock,
  paper,
  scissors
};

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      gameState: {
        id: 'game',
        status: 'lobby',
        turn: 0,
        players: []
      }
    };

    this.playerAction = this.playerAction.bind(this);
  }

  componentWillMount() {
    this.ref = base.syncState(`gameState/${this.props.match.params.id}`, {
      context: this,
      state: 'gameState'
    });
  }

  componentDidMount() {
    let { currentPlayer, games } = this.props;
    const gameId = this.props.match.params.id;
    if (games.length > 0) {
      games = games.map(game => {
        if (game.id === gameId) {
          const playerIndex = game.players.findIndex(player => player.id === currentPlayer);
          // if player isn't already in game, add them
          if (playerIndex === -1) {
            game.players.push({ id: currentPlayer });
          } else {
            console.log('player already in game');
          }
          return game;
        }
        return game;
      });
      console.log(games);
      this.props.updateGames(games);
    }
  }

  startGame = (playerOne, playerTwo) => {
    const gameId = this.props.match.params.id;

    if (playerOne && playerTwo && gameId) {
      base.post(`gameState/${gameId}`, {
        data: {
          id: gameId,
          status: 'active',
          turn: 0,
          players: [{
            id: playerOne,
            position: {
              x: 2,
              y: 0
            }
          },
          {
            id: playerTwo,
            position: {
              x: 2,
              y: 4
            }
          }]
        },
        then(err) {
          if (!err) {
            console.log('game started');
          }
        }
      });
    } else {
      console.log('You need two players to start');
      alert('Two players required');
    }
  }

  playerReady = (playerIndex) => {
    const { gameState } = this.state;
    gameState.players[playerIndex].status = 'ready';
    this.setState({ gameState });
  }

  playerAction = (playerIndex, action) => {
    console.log(playerIndex, action);
    const { gameState } = this.state;
    gameState.players[playerIndex].action = action;
    this.setState({ gameState });
  }

  resetGame = () => {
    let { gameState } = this.state;

    gameState.players[0].position = {
      x: 2,
      y: 0
    }

    gameState.players[1].position = {
      x: 2,
      y: 4
    }

    gameState.status = 'lobby';

    this.setState({ gameState });
  }

  selectAction = (playerIndex, action) => {
    const { gameState } = this.state;

    gameState.players[playerIndex].action = action;
    gameState.players[playerIndex].status = 'ready';
    this.setState({ gameState });
  }

  checkWinner = (gameState) => {
    const { players } = gameState;
    if (players[0].position.x > 4 ||
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
      console.log('No Winner Decided');
    }
  }

  checkCollision = (gameState, movingPlayer, direction) => {
    const { players } = gameState;
    const otherPlayer = movingPlayer === 0 ? 1 : 0;
    if (players[0].position.x === players[1].position.x &&
      players[0].position.y === players[1].position.y
    ) {
      console.log('COLLISION DETECTED');
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
        console.log('error moving character');
      }

      this.setState({ gameState });
    } else {
      // if no collision, set game state normall
      this.setState({ gameState });
    }

    this.checkWinner(gameState);
  }

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
      console.log('player passed');
    }

    gameState.turn = gameState.turn === 0 ? 1 : 0;

    this.checkCollision(gameState, index, direction);

    // this.setState({ gameState });
  }

  render() {
    const { gameState } = this.state;
    const { status } = gameState;
    const { games, currentPlayer } = this.props;
    const gameId = this.props.match.params.id;
    const currentGame = games.filter(game => game.id === gameId)[0];

    const bothPlayersReady = (gameState) => {
      const playerStates = gameState.players.map(player => player.status);
      if (playerStates.includes('selecting')) {
        return false;
      }
      return true;
    };

    if (currentGame && status === 'lobby') {
      return (
        <Row>
          <Col>
            <Card>
              <CardHeader>
                {currentGame.id}
                <img src={clipboard} />
              </CardHeader>
              <ListGroup>
                {currentGame && (
                  currentGame.players.map(player => {
                    return (
                      <ListGroupItem>{player.id}</ListGroupItem>
                    );
                  })
                )
                }
              </ListGroup>
              <Button onClick={() => this.startGame(currentGame.players[0].id, currentGame.players[1].id)}>Start Game</Button>
            </Card>
          </Col>
        </Row>
      );
    }

    if (currentGame && (status === 'active' || status === 'ended')) {
      return (
        <div className="view">
          <Card>
            <CardHeader className="copy-link-header">
              <CopyToClipboard
                text={`${window.location.origin}/game/${currentGame.id}`}
                onCopy={() => this.props.createNotification('success')}
              >
                <div>
                  Game Started: {currentGame.id}
                  <img src={clipboard} className="clipboard-icon" />
                </div>
              </CopyToClipboard>
            </CardHeader>
            <CardBody>
              {
                gameState.players.map((player, index) => {
                  const currentPlayersTurn = gameState.turn === index ? true : false;
                  return (
                    <Row className="grid-wrapper">
                      {
                        currentPlayersTurn && (
                          <div>
                            It's Your Turn!
                          </div>
                        )
                      }
                      {
                        (player.id === currentPlayer) && (
                          <div className="grid-container">
                            {
                              [...Array(25)].map(square =>
                                <div className="grid-square" />
                              )
                            }
                            {
                              gameState.players.map((player, index) =>
                                <Player player={player} index={index} />
                              )
                            }
                          </div>
                        )
                      }
                      {
                        currentPlayersTurn && (player.id === currentPlayer) && status === 'active' && (
                          <div>
                            <Button
                              onClick={() => this.movePlayer('up', index)}
                              color="primary"
                              disabled={player.position.y === 0}
                            >
                              Up
                            </Button>
                            <Button
                              onClick={() => this.movePlayer('down', index)}
                              color="primary"
                              disabled={player.position.y === 4}
                            >
                              Down
                            </Button>
                            <Button
                              onClick={() => this.movePlayer('left', index)}
                              color="primary"
                              disabled={player.position.x === 0}
                            >
                              Left
                            </Button>
                            <Button
                              onClick={() => this.movePlayer('right', index)}
                              color="primary"
                              disabled={player.position.x === 4}
                            >
                              Right
                            </Button>
                            <Button
                              onClick={() => this.movePlayer('pass', index)}
                              color="primary"
                            >
                              Pass
                            </Button>
                          </div>
                        )
                      }
                    </Row>
                  );
                })
              }
              {
                status === 'ended' && (
                  <Button color="primary" onClick={() => this.resetGame()}>
                            Reset Game
                  </Button>
                )
              }
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
