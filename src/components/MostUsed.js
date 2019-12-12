import * as React from "react";
import Spinner from "react-bootstrap/Spinner";
import OverlayMessage from "./OverlayMessage";
import Table from "react-bootstrap/Table";
import {Config} from "../Config";
import {LayoutHeader} from "./Common";

export default class MostUsed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      isLoading: false,
    };
  }

  async loadIngredients() {
    this.setState({isLoading: true});

    try {
      const res = await fetch(`${Config.API}/ingredients/most_used`);

      if (res.status === 200) {
        const json = await res.json();
        this.setState({ingredients: json, isLoading: false});
      } else {
        throw new Error('Coś poszło nie tak...');
      }
    } catch (error) {
      this.setState({
        msg: {"msg": error.message, 'variant': 'danger'},
        isLoading: false
      });
    }
  }

  async componentDidMount() {
    await this.loadIngredients();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Wczytywanie danych...</span>
        </Spinner>);
    }

    let msg = null;
    if (this.state.msg) {
      msg = <OverlayMessage msg={this.state.msg}/>;
      this.setState({msg: null})
    }

    return (
      <>
        {msg}
        <LayoutHeader content="Ranking najczęściej używanych składników"/>
        <IngredientsTable ingredients={this.state.ingredients}/>
      </>
    )
  }
}

function IngredientsTable(props) {
  if (!props.ingredients) {
    return null
  }

  let tableBody = [];
  for (const [idx, ingredient] of props.ingredients.entries()) {
    console.log(ingredient);
    tableBody.push(<tr key={idx}>
      <td>{ingredient.ingredient_name}</td>
      <td>{ingredient.popularity}</td>
    </tr>)
  }

  return (<Table striped bordered hover>
      <thead>
      <tr>
        <th>Nazwa</th>
        <th>W ilu daniach składnik jest używany?</th>
      </tr>
      </thead>
      <tbody>
      {tableBody}
      </tbody>
    </Table>
  )
}

