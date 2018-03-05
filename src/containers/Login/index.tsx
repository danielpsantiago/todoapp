import * as React from "react";
import { inject, observer } from 'mobx-react';
import { RouterStore } from "mobx-react-router";
import {AuthStore} from "../../stores/AuthStore";
import RaisedButton from "material-ui/RaisedButton";
import { autobind } from "core-decorators";
import CircularProgress from "material-ui/CircularProgress";
import Card from "material-ui/Card"
import * as materialColors from "material-ui/styles/colors";
import TextField  from "material-ui/TextField";

const s = require("./style.scss");

interface IProps {
    authStore?: AuthStore;
    routingStore?: RouterStore;
}
@inject("routingStore", "authStore")
@observer
@autobind
export default class Login extends  React.Component<IProps, {}> { 

    private onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.authStore.login();
    }

    public render() {
        return (
            <div className={s.container}>
                <Card
                    className={s.loginCard}
                    style={{ backgroundColor: materialColors.grey200, padding: "1px" }}
                    containerStyle={{ width: "100%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    {
                        !this.props.authStore.isLoading ? (
                            <form className={s.loginForm} onSubmit={(e) => this.onSubmit(e)}>
                                <div className={s.logo} /> 
                                <TextField className={s.usernameTextField}  style= {{width: "50%"}} onChange={(_, value) => this.props.authStore.setUsername(value)} hintText="Username" type="email" />
                                <TextField className={s.passwordTextField} style= {{width: "50%"}} onChange={(_, value) => this.props.authStore.setPassword(value)} hintText="Password" type="password"/>
                                <RaisedButton primary={true} type="submit" className={s.buttonLogin} style= {{width: "65%"}} label="Entrar" />
                                <label className={s.loginErrorLabel}>{this.props.authStore.errorMessage}</label>
                            </form>
                        ) : 
                        <CircularProgress />
                    }
                </Card>
            </div>
        );
    }
}