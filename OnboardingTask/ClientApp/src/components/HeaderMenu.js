import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu, Container } from "semantic-ui-react";

export class HeaderMenu extends Component {
    displayName = HeaderMenu.name
    render() {
        let menuItems = [];
        for (let i = 0; i < this.props.items.length; i++) {
            if (this.props.items[i].length !== 2) {
                console.error('HeaderMenu: items format should be ["name", "route"]');
                break;
            }
            const name = this.props.items[i][0];
            const route = this.props.items[i][1];
            menuItems.push(
                <Menu.Item
                    key={"item-" + i}
                    index={i}
                    as={i !== 0 ? Link : ''}
                    to={route}
                    header={i === 0}
                    name={name}
                />
            );
        }
        return (
            <Menu fixed="top" inverted>
                <Container>{menuItems}</Container>
            </Menu>
        );
    }
}

HeaderMenu.propTypes = {
    onItemClick: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired
};
