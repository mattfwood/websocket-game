import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

// import KeyHandler, { KEYPRESS } from 'react-key-handler';
import { Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';

import base from './base';
import Level from './Level';
// import Player from './Player';
import shortid from 'shortid';
import { Link } from 'react-router-dom';

const Haikunator = require('haikunator');
const haikunator = new Haikunator();

class App extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   currentPlayer: '',
    //   players: [],
    //   games: []
    // };
  }

  createGame = (creator) => {
    const { games } = this.state;
    const id = haikunator.haikunate({tokenLength: 0, delimiter: '-'});

    games.push({
      id,
      players: [{
        id: creator
      }]
    });

    this.setState({ games });
  }

  joinGame = (gameId, playerId) => {
    let { games } = this.state;

    games = games.map(game => {
      if (game.id === gameId) {
        // add player to matching game
        game.players.push({ id: playerId });
        return game;
      }
      // else return game
      return game;
    });

    this.setState({ games });
  }

  deleteGame = (gameId) => {
    let { games } = this.state;

    games = games.filter(game => {
      return game.id !== gameId;
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
              this.props.players.map(player => {
                return (
                  <ListGroupItem>{ player.id }</ListGroupItem>
                );
              })
            }
          </ListGroup>
          <h5>Games</h5>
          {
            this.props.games.map(game => {
              return (
                <Card>
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    Game ID: { game.id }
                    <div>
                      <Link to={`/game/${game.id}`}>
                        <Button>
                        Join Game
                        </Button>
                      </Link>
                      <Button onClick={() => this.deleteGame(game.id)} style={{ marginLeft: 10 }}>
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
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
          <Button color="primary" onClick={() => this.props.createGame(this.props.currentPlayer)}>Create Game</Button>
        </Level>
        <Button color="primary" onClick={() => this.setState({ players: [] })}>Reset</Button>
      </div>
    );
  }
}

App.propTypes = {
  createGame: PropTypes.func,
  players: PropTypes.array,
  games: PropTypes.array
}

export default App;
