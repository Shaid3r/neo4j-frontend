import React from "react";
import Select from 'react-select';
import {ErrorMessage, LayoutHeader} from "./Common";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {Config} from "../Config";
import Spinner from "react-bootstrap/Spinner";
import {Link} from "react-router-dom";

export default class DishFinder extends React.Component {
  state = {
    selectedOptions: null,
    isLoading: false,
    ingredients: null,
    foundDishes: null
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Wczytywanie danych...</span>
        </Spinner>);
    }

    const {selectedOptions} = this.state;

    let options = [];
    if (this.state.ingredients) {
      options = this.state.ingredients.map((ingredient) => ({"value": ingredient, "label": ingredient}));
    }

    return (
      <>
        <LayoutHeader content="Znajdź danie zawierające podane składniki"/>
        <ErrorMessage error={this.state.error}/>
        <Select
          value={selectedOptions}
          onChange={selectedOptions => this.setState({selectedOptions})}
          options={options}
          isMulti={true}
        />
        <Button style={{"float": "right", "margin": "40px 100px"}} onClick={this.findDishes}>
          Szukaj
        </Button>
        <div style={{"clear": "both"}}/>
        <DishSearchResultTable foundDishes={this.state.foundDishes}/>
      </>
    );
  }

  async componentDidMount() {
    await this.loadIngredients();
  }

  async loadIngredients() {
    this.setState({isLoading: true, error: null});
    try {
      const res = await fetch(`${Config.API}/ingredients`);

      if (res.status === 200) {
        const json = await res.json();
        this.setState({ingredients: json, isLoading: false});
      } else {
        throw new Error('Coś poszło nie tak...');
      }
    } catch (error) {
      this.setState({error, isLoading: false});
    }
  }

  findDishes = async () => {
    if (!this.state.selectedOptions) {
      this.setState({"error": "Składniki nie zostały wybrane"});
      return
    }

    this.setState({isLoading: true, "error": null});

    try {
      const res = await fetch(`${Config.API}/dishes/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"ingredients": this.state.selectedOptions.map((el) => el.value)})
      });

      if (res.status === 200) {
        const foundDishes = await res.json();
        this.setState({foundDishes, isLoading: false});
      } else {
        throw new Error('Coś poszło nie tak...');
      }
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      });
    }
  };
};

function DishSearchResultTable({foundDishes}) {
  if (foundDishes === null) {
    return null
  }

  let tableBody = [];
  for (const [idx, dish] of foundDishes.entries()) {
    tableBody.push(
      <tr key={idx}>
        <td><Link to={`/dish/${dish.dish_uuid}`}>{dish.dish_name}</Link></td>
        <td>{dish.similarity}</td>
      </tr>)
  }

  return (
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>Nazwa</th>
        <th>Liczba użytych składników</th>
      </tr>
      </thead>
      <tbody>
      {tableBody}
      </tbody>
    </Table>
  )
}