import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import {Config} from "../Config";
import OverlayMessage from "./OverlayMessage";
import {Link} from 'react-router-dom'
import {postData} from "../utils";
import {HeaderWrapper} from "./Common";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class Dishes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: null,
      isLoading: false,
      formVisible: false
    };
  }

  async componentDidMount() {
    console.log("componentDidMount");
    await this.loadDishes();
  }

  async loadDishes() {
    this.setState({isLoading: true});

    try {
      const res = await fetch(`${Config.API}/dishes`);

      if (res.status === 200) {
        const json = await res.json();
        this.setState({dishes: json, isLoading: false});
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

  async deleteDish(uuid) {
    try {
      let res = await fetch(`${Config.API}/dish/${uuid}`, {method: 'DELETE'});
      if (res.status === 201) {
        this.showMessage({"msg": "Danie zostało usunięte", variant: 'success'});
      } else if (res.status === 404) {
        throw new Error('Nie ma takiego dania');
      } else {
        throw new Error('Wystąpił błąd. Spróbuj później');
      }
    } catch (error) {
      this.showMessage({"msg": error.message, variant: 'danger'});
    }
    this.loadDishes()
  }

  showMessage(msg) {
    this.setState({
      msg: msg,
    });
  }

  toggleForm() {
    this.setState({formVisible: !this.state.formVisible});
    // this.loadDish() TODO
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Wczytywanie danych...</span>
        </Spinner>);
    }

    if (this.state.formVisible) {
      return (
        <>
          <DishesFormHeader onClick={() => this.toggleForm()}/>
          <AddDishForm/>
        </>
      )
    }

    let msg = null;
    if (this.state.msg) {
      msg = <OverlayMessage msg={this.state.msg}/>;
      this.setState({msg: null})
    }

    return (
      <>
        {msg}
        <DishesHeader onClick={() => this.toggleForm()}/>
        <DishesTable dishes={this.state.dishes} deleteDish={(uuid) => this.deleteDish(uuid)}/>
      </>
    )
  }
};

const ButtonsWrapper = styled.div`
  padding: 2em 3em 3em 3em;
`;


function DishRow(props) {
  return (
    <tr>
      <td><Link to={`/dish/${props.dish.uuid}`}>{props.dish.name}</Link></td>
      <td><Button onClick={() => props.deleteDish(props.dish.uuid)}>Usuń</Button></td>
    </tr>
  )
}

class DishesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: props.dishes,
      deleteDish: props.deleteDish
    };
  }

  render() {
    if (!this.state.dishes) {
      return null
    }

    let tableBody = [];
    for (const [idx, dish] of this.state.dishes.entries()) {
      tableBody.push(<DishRow dish={dish} key={idx} deleteDish={this.state.deleteDish}/>)
    }

    return (<Table striped bordered hover>
        <colgroup>
          <col span="1" style={{"width": "85%"}}/>
          <col span="1" style={{"width": "15%"}}/>
        </colgroup>
        <thead>
        <tr>
          <th>Nazwa</th>
          <th>Usuń</th>
        </tr>
        </thead>
        <tbody>
        {tableBody}
        </tbody>
      </Table>
    )
  }
}

function Ingredient() {
  return (
    <Form.Group>
      <Row>
        <Col>
          <Form.Control name="ingName" placeholder="Nazwa składnika"/>
        </Col>
        <Col>
          <Form.Control type="number" name="ingQuantity" placeholder="Ilość"/>
        </Col>
      </Row>
    </Form.Group>
  )
}

class AddDishForm extends React.Component {
  state = {
    numIngredient: 1
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onAddIngredient = () => {
    this.setState({
      numIngredient: this.state.numIngredient + 1
    });
  };

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    let dataToSend = {};
    dataToSend["name"] = form.elements["dishName"].value;

    let ingredientsNames = [];
    if (form.elements["ingName"].length !== undefined) {
      for (let el of form.elements["ingName"])
        ingredientsNames.push(el.value)
    } else {
      ingredientsNames.push(form.elements["ingName"].value)
    }

    let ingredientsQuantities = [];
    if (form.elements["ingQuantity"].length !== undefined) {
      for (let el of form.elements["ingQuantity"])
        ingredientsQuantities.push(el.value)
    } else {
      ingredientsQuantities.push(form.elements["ingQuantity"].value)
    }

    const zip = (arr1, arr2) => arr1.reduce((result, k, i) => {
      const quantity = arr2[i];
      if (k && quantity)
        result.push({"name": k, "quantity": arr2[i]});
      return result
    }, []);

    dataToSend["ingredients"] = zip(ingredientsNames, ingredientsQuantities);

    this.setState({isLoading: true});
    try {
      let res = await postData(`${Config.API}/dishes`, dataToSend);
      if (res.status === 201) {
        this.setState({isLoading: false, msg: {"msg": "Danie zostało dodane", 'variant': 'success'},});
      } else if (res.status === 400) {
        throw new Error('Dane są niepoprawne');
      } else {
        throw new Error('Wystąpił błąd. Spróbuj później');
      }
    } catch (error) {
      this.setState({
        msg: {"msg": error.message, 'variant': 'danger'},
        isLoading: false
      });
    }
  }

  render() {
    let children = [];

    for (let i = 0; i < this.state.numIngredient; i += 1) {
      children.push(<Ingredient key={i}/>);
    }

    if (this.state.isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Wczytywanie danych...</span>
        </Spinner>);
    }

    return (
      <>
        {this.state.msg && <OverlayMessage msg={this.state.msg}/>}
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="dishName">
            <Form.Control name="dishName" placeholder="Nazwa dania"/>
          </Form.Group>

          {children}

          <ButtonsWrapper>
            <Button type="submit">
              Wyślij
            </Button>

            <Button style={{"marginLeft": "40px"}} onClick={this.onAddIngredient}>
              Dodaj składnik
            </Button>
          </ButtonsWrapper>
        </Form>
      </>
    );
  }
}

function DishesHeader(props) {
  return (
    <HeaderWrapper>
      <div style={{"float": "left", "fontSize": "1.2em"}}>
        <h1>Lista dań</h1>
      </div>
      <div style={{"float": "right", "marginLeft": "30px"}}>
        <Button onClick={props.onClick}>Dodaj danie</Button>
      </div>
    </HeaderWrapper>
  )
}

function DishesFormHeader(props) {
  return (
    <HeaderWrapper>
      <div style={{"float": "left", "fontSize": "1.2em"}}>
        <h1>Dodawanie nowego dania</h1>
      </div>
      <div style={{"float": "right", "marginLeft": "30px"}}>
        <Button onClick={props.onClick}>Pokaż liste</Button>
      </div>
    </HeaderWrapper>
  )
}
