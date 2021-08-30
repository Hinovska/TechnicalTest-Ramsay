import React, { Component, ReactNode } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export type LayoutProps = {
    children: ReactNode;
}

type LayoutState = {
    Loaded: boolean;
};

export default class Layout extends Component<LayoutProps, LayoutState> {
    constructor(props) {
        super(props);
    };

    render () {
    return (
        <div>
            <NavMenu displayName="NavMenu" />
        <Container>
            {this.props.children}
        </Container>
        </div>
    );
    }
}
