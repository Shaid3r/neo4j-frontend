import React from "react";
import {ErrorMessage, LayoutHeader} from "./Common";
import Spinner from "react-bootstrap/Spinner";
import {Config} from "../Config";
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class DishDetail extends React.Component {
  state = {
    isLoading: false,
    dish: null,
    editMode: false
  };

  constructor(props) {
    super(props);
    this.dishId = props.match.params.dishId
  }

  async componentDidMount() {
    await this.loadDish();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Wczytywanie danych...</span>
        </Spinner>);
    }

    let {dish, editMode} = this.state;

    let details = null;
    if (dish) {
      details = (
        <>
          {!editMode &&
          <h4>Nazwa dania: {dish.name} (<Link to="#" onClick={() => this.setState({editMode: true})}>Edytuj</Link>)
          </h4>}
          {editMode &&
          <Form onSubmit={this.changeDishName}>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Control name="newDishName" placeholder={dish.name}/>
                </Col>
                <Col>
                  <Button type="submit">Potwierdź</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          }
          < IngredientsTable ingredients={dish.ingredients}/>
        </>
      );
    }

    return (
      <>
        <LayoutHeader content="Szczegóły dania"/>
        <ErrorMessage error={this.state.error}/>
        {details}
      </>
    )
  }

  changeDishName = async (event) => {
    event.preventDefault();
    this.setState({error: null, editMode: false});
    const newDishName = event.target.elements["newDishName"].value;
    if (!newDishName) return;

    this.setState({isLoading: true});
    try {
      const res = await fetch(`${Config.API}/dish/${this.dishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name": newDishName})
      });

      if (res.status === 201) {
        let dish = this.state.dish;
        dish.name = newDishName;
        this.setState({dish, isLoading: false});
      } else if (res.status === 404) {
        throw new Error('Nie ma takiego dania');
      } else {
        throw new Error('Coś poszło nie tak...');
      }
    } catch (error) {
      this.setState({error, isLoading: false});
    }
  };

  async loadDish() {
    this.setState({isLoading: true, error: null});

    try {
      const res = await fetch(`${Config.API}/dish/${this.dishId}`);

      if (res.status === 200) {
        const dish = await res.json();
        this.setState({dish, isLoading: false});
      } else {
        throw new Error('Coś poszło nie tak...');
      }
    } catch (error) {
      this.setState({error, isLoading: false});
    }
  }
}

function IngredientsTable({ingredients}) {
  if (!ingredients) {
    return <p>Brak składników</p>
  }

  let tableBody = [];
  for (const [idx, ingredient] of ingredients.entries()) {
    tableBody.push(
      <tr key={idx}>
        <td>{ingredient.name}</td>
        <td>{ingredient.quantity}</td>
      </tr>)
  }

  return (
    <Table striped bordered hover style={{"marginTop": "30px"}}>
      <thead>
      <tr>
        <th>Składnik</th>
        <th>Ilość</th>
      </tr>
      </thead>
      <tbody>
      {tableBody}
      </tbody>
    </Table>
  )
}
