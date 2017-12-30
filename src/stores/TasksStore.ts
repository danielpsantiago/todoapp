import { autobind } from 'core-decorators';
import { routingStore } from "./RoutingStore";
import axios, { AxiosResponse } from "axios";
import { observable, computed, action, runInAction } from "mobx";
import Task from "../entity/task";
import MyTasks from "../containers/MyTasks/index";
import { access } from "fs";

@autobind
export class TasksStore {

    public routerStore = routingStore;
    @observable lastDeletedTasks: Task[] = [];
    @observable isLoading = false;
    @observable errorMessage: string = "";
    @observable tasks: Task[] = [];
    @observable isCreateTaskDialogOpen = false;
    @observable isUndoDeleteSnackBarOpen = false;

    @action public getMyTasks(userId: string) {
        this.isLoading = true;
        axios.get(
            API_HOST + `/tasks/findTasksByAssignee?assigneeId=${userId}`
        ).then((response) => {
            runInAction(() => {
                this.isLoading = false;
                this.tasks = response.data
            })
        }).catch((error) => {
            runInAction(() => {
                this.isLoading = false;
				this.errorMessage = error.response.data.message ? error.response.data.message : error.message
            })
        })
    }

    public getShowableTasks(): Task[] {
        return this.tasks.filter((task) => { return !task.deleted });
    }

    @action public changeCompletedStatus(task: Task, isCompleted: boolean, position: number) {
        this.tasks.find((element) => { return task._id === element._id }).completed = isCompleted;
        axios.patch(
            API_HOST + `/tasks/complete?taskId=${task._id}` 
        )
    }

    @action public openNewTaskDialog() {
        this.isCreateTaskDialogOpen = true;
    }

    @action public closeNewTaskDialog() {
        this.isCreateTaskDialogOpen = false;
    }

    @action public createTask(task: Task) {
        this.isCreateTaskDialogOpen = false;
        this.isLoading = true;
        axios.post(
            API_HOST + "/tasks/create",
            task
        ).then((response) => {
            runInAction(() => {
                this.isLoading = false;
                this.getMyTasks(task.assigneeId)
            })
        }).catch((error) => {
            runInAction(() => {
                this.isLoading = false;
				this.errorMessage = error.response.data.message ? error.response.data.message : error.message
            })
        })
    }

    @action public startDeleteTaskProcess(task: Task) {
        this.isLoading = true;
        this.lastDeletedTasks.push(task)
        this.tasks.find((element) => { return task._id === element._id }).deleted = true;
        this.isUndoDeleteSnackBarOpen = true;
    }

    @action public actualDeleteTasks() {
        var indexToBeDeleted = this.lastDeletedTasks.length;
        var taskToBeDeleted = this.lastDeletedTasks[indexToBeDeleted-1];
        this.isUndoDeleteSnackBarOpen = false;
        axios.patch(
            API_HOST + `/tasks/delete?taskId=${taskToBeDeleted._id}` 
        ).then((response) => {
            runInAction(() => {
                this.lastDeletedTasks.slice(indexToBeDeleted, 1);
                this.tasks.slice(this.tasks.indexOf(taskToBeDeleted), 1);
            });
        })     
    }

    @action public undoLastDeletion() {
        var undoDeleteTask = this.lastDeletedTasks.pop();
        this.tasks.find((element) => { return undoDeleteTask._id === element._id }).deleted = false;
        this.isUndoDeleteSnackBarOpen = false;
    }
}

export const tasksStore = new TasksStore();