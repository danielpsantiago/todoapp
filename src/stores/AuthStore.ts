import { observable, computed, action, runInAction } from "mobx";
import { RouterStore } from "mobx-react-router";
import { User } from "../entity/user";
import axios, { AxiosResponse } from "axios";
import { routingStore } from "./RoutingStore";

export class AuthStore {
	public routerStore = routingStore;	
	@observable public username: string = "";
	@observable public password: string = "";
	@observable public isLogged: boolean = false;
	@observable public isLoading: boolean = false;
	@observable public loginIsWrong: boolean = false;
	@observable public user: User;
	@observable public errorMessage: string = "";
	
	@action public login = async () => {
		this.isLoading = true;
		axios.post(
				API_HOST + "/users/authenticate",
				{
					email: this.username,
					password: this.password
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					}
				}
		).then((response) => {
			runInAction(() => {
				this.loginIsWrong = false;
				this.user = response.data
				this.isLoading = false;		
				localStorage.setItem("userId", this.user._id);
				localStorage.setItem("name", this.user.name);
				localStorage.setItem("email", this.user.email);
				this.routerStore.push("/mytasks");				
			});
		}).catch((error) => {
			runInAction(() => {
				this.isLoading = false;
				this.loginIsWrong = true;
				this.errorMessage = error.response.data.message ? error.response.data.message : error.message
			});
		});
	}

	@action public setUsername = (username: string) => {
		this.username = username;
	}

	@action public setPassword = (password: string) => {
		this.password = password;
	}

	@action public signOut = async () => {
		localStorage.removeItem("email");
		localStorage.removeItem("name");
		localStorage.removeItem("userId");
		routingStore.push("/login");
	}
}

export const authStore = new AuthStore();
