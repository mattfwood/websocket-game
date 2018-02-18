import React, { Component } from 'react';
import { Col, Row, Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import PlayerView from './PlayerView';
import base from '../base';
import Rock from '../rock.png';
import Paper from '../paper.png';
import Scissors from '../scissors.png';

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
          ;
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

  render() {
    const { status } = this.state.gameState;
    const { games } = this.props;
    const gameId = this.props.match.params.id;
    const currentGame = games.filter(game => game.id === gameId)[0];

    if (currentGame && status !== 'active') {
      return (
        <Row>
          <Col>
            <Card>
              <CardHeader>
                {currentGame.id}
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
            <CardHeader>
              Game Started: {currentGame.id}
            </CardHeader>
            <CardBody>
              <PlayerView
                gameState={this.state.gameState}
                player={this.props.currentPlayer}
                playerReady={this.playerReady}
                playerAction={this.playerAction}
                resetGame={this.resetGame}
              />
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
