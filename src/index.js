import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

import {
  Container,
  Navbar,
  NavbarBrand,
  NavItem,
  Collapse,
  NavbarToggler,
  Nav,
  NavLink
} from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import newUser from './helpers/newUser';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import base from './base';

require('disable-react-devtools');

const Haikunator = require('haikunator');
const haikunator = new Haikunator();

class Root extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      currentPlayer: '',
      players: [],
      games: [],
      collapsed: true
    };
  }

  componentWillMount() {
    this.ref = base.syncState('players', {
      context: this,
      state: 'players',
      asArray: true
    });

    this.ref = base.syncState('gameState', {
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
          name: ''
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
    // const { games } = this.state;
    const id = haikunator.haikunate({ tokenLength: 0, delimiter: '-' });

    // games.push({
    //   id,
    //   players: [{
    //     id: creator
    //   }]
    // });

    base.post(`gameState/${id}`, {
      data: {
        id,
        status: 'lobby',
        turn: 0,
        players: [{
          id: creator,
        }]
      }
    })
      .then(err => {
      if (!err) {
        console.log('game created')
      }
    });

  // this.setState({ games });
}

updateGames = (games) => {
  this.setState({ games });
}

resetState = () => {
  this.setState({
    players: [],
    games: []
  });
}

toggleNavbar() {
  this.setState({
    collapsed: !this.state.collapsed
  });
}

render() {
  return (
    <Router>
      <div>
        <Navbar dark color="dark">
          <NavbarBrand style={{ color: '#FFF' }}>
            <Link to="/">Game</Link>
          </NavbarBrand>
          <div style={{ color: '#FFF' }}>
            Your ID: {this.state.currentPlayer}
          </div>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="navbar-brand" onClick={() => this.resetState()}>Reset Game</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container className="mt-3">
          <Route exact path="/" render={() => (
            <div>
              <MainMenu createGame={this.createGame} {...this.state} />
            </div>
          )} />
          <Route path="/game/:id" render={(props) => (
            <Game
              updateGames={this.updateGames}
              {...this.state}
              {...props}
            />
          )} />
        </Container>
      </div>

    </Router>

  );
}
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
