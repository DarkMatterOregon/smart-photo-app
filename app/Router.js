import React, { Component } from "react";
import { Scene, Router, Stack, Drawer, Actions } from "react-native-router-flux";
import HomeView from "./components/HomeView";
import BandsList from "./components/Bands/BandsList";
import BandProfile from "./components/Bands/BandProfile";
import ArtistsList from "./components/Artists/ArtistsList";
import AwardsList from "./components/Awards/AwardsList";
import DrawerContent from "./components/DrawerContent";
import MenuIcon from "./image/hamburger_menu.png";

import { AppConsumer } from './App';
import LoginWithQrCode from "./components/LoginWithQrCode";
import AwardElement from "./components/Awards/AwardElement";
import LoginWithAccount from "./components/LoginWithAccount";

import { primary, light, extraDark } from './colors';

const styles = {
    textStyle: {
        fontSize: 20
    },
    navBarStyle: {
        backgroundColor: primary,
        height: 50,
        paddingTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 2
    },
    navTitle: {
        alignSelf: "center",
        flex: 1,
        textAlign: "center",
        color: light
    }
};

class RouterComponent extends Component {
    stateHandler = (prevState, newState, action) => {
        //console.log("onStateChange: ACTION:", action);
    };


    render() {
        const navColors = {
            navBarButtonColor: extraDark
        };

        return (
            <AppConsumer>
                {({ appState }) => {
                    if (appState.isLoggedIn) {
                        return (
                            <Router onStateChange={this.stateHandler}>
                                <Stack
                                    key="root"
                                    titleStyle={{ alignSelf: "center" }}
                                    hideNavBar
                                >
                                    <Drawer
                                        key="drawer"
                                        hideNavBar
                                        contentComponent={DrawerContent}
                                        drawerImage={MenuIcon}
                                        drawerWidth={250}
                                        drawerPosition="right"
                                    >
                                        <Stack
                                            key="main"
                                            titleStyle={styles.navTitle}
                                            navigationBarStyle={styles.navBarStyle}
                                            title="Make A Band 2019"
                                        >
                                            {/*<Scene key="events" component={Events}  />*/}

                                            {/* place in renderBackButton={()=>{}} so Actions.main({onBack: () => {...}}) will work. */}
                                            <Scene key="homeView" component={HomeView} title="Home" initial />
                                            <Scene key="bandsView" component={BandsList} title="Bands" {...navColors} />
                                            <Scene key="artistsView" component={ArtistsList} title="Artists" {...navColors} />
                                            <Scene key="awardsView" component={AwardsList} title="Awards" {...navColors} />
                                            <Scene key="awardElement" component={AwardElement} title="Award" {...navColors} />
                                            <Scene key="bandProfile" component={BandProfile} title="bandProfile" {...navColors} />
                                        </Stack>
                                    </Drawer>
                                </Stack>
                            </Router>
                        );
                    }

                    return <LoginWithQrCode />;
                }}
            </AppConsumer>
        );
    }
}


export default RouterComponent;
