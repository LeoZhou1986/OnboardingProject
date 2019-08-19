import React, { Component } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Divider, Container } from "semantic-ui-react";
import { HeaderMenu } from './components/HeaderMenu';
import { Footer } from './components/Footer';
import { Customers } from './components/Customers';
import { Products } from './components/Products';
import { Stores } from './components/Stores';
import { Sales } from './components/Sales';

export default class App extends Component {
    displayName = App.name
    render() {
        return (
            <Router>
                <Container>
                    <HeaderMenu
                        onItemClick={item => this.onItemClick(item)}
                        items={[
                            ["OnboardingTask", "/"],
                            ["Customers", "/customers"],
                            ["Products", "/products"],
                            ["Stores", "/stores"],
                            ["Sales", "/sales"]
                        ]}
                    />
                    <Divider />
                    <Container style={{ marginTop: '3em' }}>
                        <Switch>
                            <Route path="/" exact component={Customers} />
                            <Route path="/customers" component={Customers} />
                            <Route path="/products" component={Products} />
                            <Route path="/stores" component={Stores} />
                            <Route path="/sales" component={Sales} />
                        </Switch>
                    </Container>
                    <Divider />
                    <Footer />
                </Container>
            </Router>
        );
    }
}
