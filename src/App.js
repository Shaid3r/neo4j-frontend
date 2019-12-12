import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {NavigationBar} from "./components/NavigationBar";
import {Layout} from "./components/Layout";
import {NoMatch} from "./NoMatch";
import Dishes from "./components/Dishes";
import MostUsed from "./components/MostUsed";
import DishFinder from "./components/DishFinder";
import DishDetail from "./components/DishDetail";

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar/>
        <Layout>
          <Switch>
            <Route exact path="/" component={Dishes}/>
            <Route exact path="/dish/:dishId" component={DishDetail}/>
            <Route exact path="/find-dish" component={DishFinder}/>
            <Route exact path="/most-used" component={MostUsed}/>
            <Route component={NoMatch}/>
          </Switch>
        </Layout>
      </Router>
    </React.Fragment>
  );
}

export default App;
