import * as React from "react";
import * as ReactDOM from "react-dom";
import {observable} from "mobx";
import {observer} from "mobx-react";
import { Router, Route } from "react-router";
import { Provider } from "mobx-react";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import createBrowserHistory from 'history/createBrowserHistory';

import App from "./containers/App";

import * as rootStores from "./stores/index";

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, rootStores.routingStore);

ReactDOM.render(
    <Provider {...rootStores} >
        <Router history={history} >
            <App />
        </Router>
    </Provider >,
    document.getElementById('root')
);