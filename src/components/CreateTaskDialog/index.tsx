import * as React from "react";
import { inject, observer } from 'mobx-react';
import { autobind } from "core-decorators";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { TasksStore } from "../../stores/TasksStore"
import { TextField } from "material-ui";
import { observable } from "mobx";
const s = require("./style.scss")

interface IProps extends __MaterialUI.DialogProps {
    tasksStore?: TasksStore;
}

@inject("tasksStore")
@observer
@autobind
export default class CreateTaskDialog extends React.Component<IProps, {}> {

    @observable newTaskName: string = "";

	public render() {
		const actions = [
			<FlatButton
				label="Confirm"
                primary={true}
                onClick={() => {this.props.tasksStore.createTask({
                    name: this.newTaskName,
                    completed: false,
                    assigneeId: localStorage.getItem("userId"),
                    deleted: false
                })}}
            />,
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={() => {this.props.tasksStore.closeNewTaskDialog()}}
            />
		];

		return (
			<Dialog
                open={false}
				title="Let's create a task, ok ?"
				actions={actions}
				modal={true}
				{...this.props}  
                >
                <TextField 
                    className={s.taskNameTF}
                    hintText="Specify your new task here"
                    onChange={(_, newName) => {this.newTaskName = newName} } /> 
			</Dialog>
		);
	}
}
