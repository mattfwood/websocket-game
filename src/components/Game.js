import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import base from '../base';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOne: '',
      playerTwo: '',
      games: []
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    let { games, currentPlayer } = nextProps;
    const gameId = nextProps.match.params.id;
    if (games.length > 0) {
      games = games.map(game => {
        if (game.id == gameId) {
          game.players.push({ id: currentPlayer });
          return game
        }
        return game
      });
  
      debugger
    }

    // this.props.updateGames(games);
  }

  render() {
    // const
    const { games } = this.props;
    const gameId = this.props.match.params.id;
    const currentGame = games.filter(game => game.id == gameId)[0];
    console.log(currentGame);

    if (currentGame) {
      return (
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
        </Card>
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
