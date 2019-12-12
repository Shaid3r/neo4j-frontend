import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {Link, NavLink} from 'react-router-dom'

export const NavigationBar = () => (
  <Navbar collapseOnSelect bg="dark" variant="dark">
    <Navbar.Brand as={Link} to='/'>Neo4j - Michał Szczepańczyk</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={NavLink} to='/' exact>Baza dań</Nav.Link>
        <Nav.Link as={NavLink} to='/find-dish'>Znajdź danie</Nav.Link>
        <Nav.Link as={NavLink} to='/most-used'>Najczęściej używane składniki</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);