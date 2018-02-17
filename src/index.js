import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import shortid from 'shortid';
import { Button, Nav, NavbarBrand, NavItem } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import newUser from './helpers/newUser';
import App from './App';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import base from './base';

const Haikunator = require('haikunator');
const haikunator = new Haikunator();

class Root extends Component {
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

    this.ref = base.syncState('games', {
      context: this,
      state: 'games',
      asArray: true
    });

    let id = window.localStorage.getItem('websocket-game-id');

    // if the player has a previous ID stored
    if (id) {
      // use that as the state
      this.setState({ currentPlayer: id });
    } else {
      // otherwise generate one, store it and set it
      id = newUser(this.state.players);
      window.localStorage.setItem('websocket-game-id', id);
      this.setState({ currentPlayer: id });
    }

    // const gameId = window.localStorage.getItem('websocket-game-id');

    const { players, currentPlayer } = this.state;

    const playerActive = players.filter(player => {
      return player.id === currentPlayer;
    });

    console.log(this.state);

    if (playerActive.length === 0) {
      console.log('no active players');

      base.push('players', {
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

  updateGames = (games) => {
    this.setState({ games });
  }

  resetState = () => {
    this.setState({
      currentPlayer: '',
      players: [],
      games: []
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Nav>
            <NavbarBrand>
              Your ID: { this.state.currentPlayer }
            </NavbarBrand>
            <NavItem>
              <Button onClick={() => this.resetState()}>
                Reset
              </Button>
            </NavItem>
          </Nav>

          <Route exact path="/" render={() => (
            <div>
              <MainMenu createGame={this.createGame} {...this.state}/>
            </div>
          )}/>
          <Route path="/game/:id" render={(props) => (
            <Game updateGames={this.updateGames} {...this.state} {...props}/>
          )}/>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
