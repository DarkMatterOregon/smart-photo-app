import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#5c5c5c',
            main: '#333333',
            dark: '#0c0c0c',
            contrastText: '#fff',
        },
        secondary: {
            light: '#62c1f3',
            main: '#1c91c0',
            dark: '#00638f',
            contrastText: '#fff',
        },
    },
    overrides: {
        root: {
            '& $notchedOutline': {
                borderWidth: 0
            },
            '&:hover $notchedOutline': {
                borderWidth: 0
            },
            '&$focused $notchedOutline': {
                borderWidth: 0
            }
        },
        focused: {},
        notchedOutline: {},
        MUIDataTableBodyRow: {
            'root': {}
        },
        MuiTableRow: {
            hover: {
                '&:hover': {
                    cursor: 'pointer'
                }
            }
        }
    }
});

export default class Theme extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}
