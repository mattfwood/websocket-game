import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardTitle, CardText, InputGroup, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
const Typeahead = require('react-typeahead').Typeahead;

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };
  }

  updateInput = (input) => {
    this.setState({ input: input.target.value });
  }

  selectOption = (value) => {
    this.setState({ input: value });
  }

  render() {
    return (
      <Card style={{ width: '400px' }}>
        <CardHeader>
          Main Menu
        </CardHeader>
        <CardBody>
          <CardTitle>Find Game</CardTitle>
          <InputGroup>
            <Typeahead
              options={this.props.games.map(game => game.id)}
              maxVisible={4}
              onChange={(input) => this.updateInput(input)}
              onOptionSelected={(value) => this.selectOption(value)}
              customClasses={{
                input: 'form-control',
                results: 'dropdown-menu',
                listItem: 'dropdown-item'
              }} />
            <Link to={`/game/${this.state.input}`} style={{ width: '100%' }}>
              <Button
                color="primary"
                size="lg"
                // onClick={() => this.props.createGame(this.props.currentPlayer)}
                style={{ marginTop: '15px' }}
                block
              >
                Join Game
              </Button>
            </Link>
          </InputGroup>
          <hr />
          <Button
            color="primary"
            size="lg"
            onClick={() => this.props.createGame(this.props.currentPlayer)}
            block
          >
            Create Game
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default MainMenu;