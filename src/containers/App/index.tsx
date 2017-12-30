import * as React from "react";
import { Route } from "react-router";

/**
 * Containers
 */

import PrintNumber from "../PrintNumber"
import Login from "../Login"
import MyTasks from "../MyTasks"
import { Provider } from "mobx-react";
import * as stores from "../../stores";

/** 
 * Style
 */

const s = require("./style.scss");

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { orange500, orange600, orange800 } from "material-ui/styles/colors";
const muiTheme = getMuiTheme(
    {
        palette: {
            primary1Color: orange600,
            primary2Color: orange800,
            primary3Color: orange500,
        },
    }, 
    {
		avatar: {
			borderColor: null,
		},
    }
);

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="container">
                    <Route exact path="/" component={Login} />
                    <Route path="/numero/:number" component={PrintNumber} />
                    <Route path="/mytasks" component={MyTasks} />
                </div>
            </MuiThemeProvider>
        );
    }
};