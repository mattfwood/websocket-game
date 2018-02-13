import React, { Component } from 'react';
import './App.css';

import KeyHandler, { KEYPRESS } from 'react-key-handler';
import { Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';

import base from './base';
import Level from './Level';
import Player from './Player';
import shortid from 'shortid';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: '',
      players: [],
      games: []
    };
  }

  componentWillMount() {
    // this runs right before <App> is rendered
    this.ref = base.syncState('players', {
      context: this,
      state: 'players',
      asArray: true
    });

    const id = shortid.generate();

    this.setState({ currentPlayer: id });

    const gameId = window.localStorage.getItem('websocket-game-id');

    // if (!gameId) {
    //   // add new player
    // }

    const { players, currentPlayer } = this.state;

    const playerActive = players.filter(player => {
      return player.id === currentPlayer;
    });

    console.log(this.state);

    if (playerActive.length === 0) {
      console.log('no active players');

      var addPlayer = base.push('players', {
        data: {
          id,
          position: {
            top: 0,
            left: 0
          }
        },
        then(err) {
          if (!err) {
            console.log('new player posted');
          }
        }
      });
    }
  }

  componentDidMount() {
    // const { players, currentPlayer } = this.state;

    // console.log(currentPlayer);

    // const playerActive = players.filter(player => {
    //   return player.id = currentPlayer
    // });

    // console.log(playerActive);

    // if (playerActive.length === 0) {
    //   console.log('no active players');
    //   players.push({
    //     id: currentPlayer,
    //     position: {
    //       top: 0,
    //       left: 0
    //     }
    //   });

    //   this.setState({ players });
    // }

    // console.log(playerActive);
  }

  moveLeft = () => {
    const { players, currentPlayer } = this.state;

    const activePlayerIndex = players.findIndex(player => {
      return player.id === currentPlayer;
    });

    players[activePlayerIndex].position.left -= 10;

    this.setState({ players });
  }

  moveRight = () => {
    const { players, currentPlayer } = this.state;

    const activePlayerIndex = players.findIndex(player => {
      return player.id === currentPlayer;
    });

    players[activePlayerIndex].position.left += 10;

    this.setState({ players });
  }

  moveUp = () => {
    const { players, currentPlayer } = this.state;

    const activePlayerIndex = players.findIndex(player => {
      return player.id === currentPlayer;
    });

    players[activePlayerIndex].position.top -= 10;

    this.setState({ players });
  }

  moveDown = () => {
    const { players, currentPlayer } = this.state;

    const activePlayerIndex = players.findIndex(player => {
      return player.id === currentPlayer;
    });

    players[activePlayerIndex].position.top += 10;

    this.setState({ players });
  }

  createGame = (creator) => {
    const { games } = this.state;
    const id = shortid.generate();

    games.push({
      id,
      players: [{
        id: creator
      }]
    });

    this.setState({ games });
  }

  deleteGame = (id) => {
    let { games } = this.state;

    games = games.filter(game => {
      return game.id !== id;
    });

    this.setState({ games });
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        {/* <KeyHandler keyEventName={KEYPRESS} keyValue="a" onKeyHandle={this.moveLeft} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="d" onKeyHandle={this.moveRight} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="w" onKeyHandle={this.moveUp} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={this.moveDown} /> */}
        <Level>
          <h5>Players</h5>
          <ListGroup>
            {
              this.state.players.map(player => {
                return (
                  <ListGroupItem>{ player.id }</ListGroupItem>
                );
              })
            }
          </ListGroup>
          <h5>Games</h5>
          {
            this.state.games.map(game => {
              return (
                <Card>
                  <CardHeader className="d-flex justify-content-between align-items-center">Game ID: { game.id } <Button onClick={() => this.deleteGame(game.id)}>Delete Game</Button></CardHeader>
                  <CardBody>
                    <CardTitle>Players:</CardTitle>
                    {
                      game.players.map(player => {
                        return (
                          <CardText>{ player.id }</CardText>
                        );
                      })
                    }
                  </CardBody>
                </Card>
              );
            })
          }
          <Button color="primary" onClick={() => this.createGame(this.state.currentPlayer)}>Create Game</Button>
        </Level>
        <Button color="primary" onClick={() => this.setState({ players: [] })}>Reset</Button>
      </div>
    );
  }
}

export default App;
