import React, { Component } from 'react';
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
          players: [{
            id: playerOne,
            status: 'selecting',
            action: ''
          },
          {
            id: playerTwo,
            status: 'selecting',
            action: ''
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
    gameState.players = gameState.players.map(player => {
      player.action = '';
      player.status = 'selecting';
      return player;
    });

    console.log(gameState);

    this.setState({ gameState });
  }

  selectAction = (playerIndex, action) => {
    const { gameState } = this.state;

    gameState.players[playerIndex].action = action;
    gameState.players[playerIndex].status = 'ready';
    this.setState({ gameState });
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

    if (currentGame && status !== 'active') {
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

    if (currentGame && status === 'active') {
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
                  if (player.id === currentPlayer) {
                    if (bothPlayersReady(gameState) === false) {
                      return (
                        <Row>
                          <Col className="d-flex justify-content-center">
                            <img
                              onClick={() => this.selectAction(index, 'rock')}
                              className="action" src={icon.rock}
                            />
                          </Col>
                          <Col className="d-flex justify-content-center">
                            <img
                              onClick={() => this.selectAction(index, 'paper')}
                              className="action" src={icon.paper}
                            />
                          </Col>
                          <Col className="d-flex justify-content-center">
                            <img
                              onClick={() => this.selectAction(index, 'scissors')}
                              className="action" src={icon.scissors}
                            />
                          </Col>
                          {gameState.players[index].action && (
                            <div className="text-center mt-5">
                              <h4>
                                You picked: {gameState.players[index].action}
                              </h4>
                              Waiting for other player to select...
                            </div>)
                          }
                        </Row>
                      );
                    }
                    // if both players are ready, show results screen
                    return (
                      <Results
                        gameState={gameState}
                        currentPlayer={currentPlayer}
                        icon={icon}
                      >
                        <Row>
                          <Col className="d-flex justify-content-center mt-5">
                            <Button color="primary" onClick={() => this.resetGame()}>
                              Reset Game
                            </Button>
                          </Col>
                        </Row>
                      </Results>
                    );
                  }
                  return null;
                })
              }
              {/* <PlayerView
                gameState={this.state.gameState}
                player={this.props.currentPlayer}
                playerReady={this.playerReady}
                playerAction={this.playerAction}
                resetGame={this.resetGame}
              /> */}
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
