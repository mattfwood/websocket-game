import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import base from '../base';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      gameState: {
        id: 'game',
        playerOne: '',
        playerTwo: ''
      }
    };
  }

  componentWillMount() {
    this.ref = base.syncState(`gameState/${this.props.match.params.id}`, {
      context: this,
      state: `gameState`
    });
  }

  componentDidMount() {
    let { currentPlayer, games } = this.props;
    const gameId = this.props.match.params.id;
    if (games.length > 0) {
      games = games.map(game => {
        if (game.id === gameId) {
          debugger
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

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // let { games, currentPlayer } = nextProps;
    // const gameId = nextProps.match.params.id;
    // if (games.length > 0) {
    //   games = games.map(game => {
    //     if (game.id == gameId) {
    //       const playerIndex = game.players.findIndex(player => player.id === currentPlayer);
    //       // if player isn't already in game, add them
    //       if (playerIndex > -1) {
    //         game.players.push({ id: currentPlayer });
    //       } else {
    //         console.log('player already in game');
    //       }
    //       return game;
    //     }
    //     return game;
    //   });
    //   this.props.updateGames(games);
    // }
  }

  startGame = (playerOne, playerTwo) => {
    this.setState({
      gameState: {
        id: '12345',
        playerOne: playerOne,
        playerTwo: playerTwo
      }
    });
  }

  render() {
    // const
    const { games } = this.props;
    const gameId = this.props.match.params.id;
    const currentGame = games.filter(game => game.id == gameId)[0];
    console.log(currentGame);

    if (currentGame) {
      return (
        <div className="view">
          <Card style={{ width: '500px'}}>
            <CardHeader>
              { currentGame.id }
            </CardHeader>
            <ListGroup>
              { currentGame && (
                currentGame.players.map(player => {
                  return (
                    <ListGroupItem>{ player.id }</ListGroupItem>
                  );
                })
              )
              }
            </ListGroup>
            <Button onClick={() => this.startGame(currentGame.players[0], currentGame.players[1])}>Start Game</Button>
          </Card>
        </div>
      );
    }

    return (
      <Card style={{ width: '500px'}}>
        <CardHeader>Game Not Found</CardHeader>
      </Card>
    );
  }
}

export default Game;
