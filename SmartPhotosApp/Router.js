import React, { Component } from "react";
import { Router, Scene, Action, Stack, Drawer } from "react-native-router-flux";
import HomeView from "./app/views/HomeView"

class RouterComponent extends Component {

    render() {
        return (
            <Router>
                <Stack
                    key="root"
                    titleStyle={{ alignSelf: "center" }}
                    hideNavBar
                >
                    <Scene key="home" component={HomeView} title="Smart Photos App" initial />
                </Stack>
            </Router>
        );
    }
}

export default RouterComponent;