import * as React from "react";
import { inject, observer } from 'mobx-react';
import { RouterStore } from "mobx-react-router";
import { TasksStore } from "../../stores/TasksStore";
import { autobind } from "core-decorators";
import Card from "material-ui/Card"
import { List, ListItem } from "material-ui/List"
import { Checkbox, Snackbar } from "material-ui";
import Divider from "material-ui/Divider"
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import CreateTaskDialog from "../../components/CreateTaskDialog";
import { ActionDelete } from "material-ui/svg-icons";
const s = require("./style.scss")

interface IProps {
    tasksStore?: TasksStore;
    routingStore?: RouterStore;
}

@inject("routingStore", "tasksStore")
@observer
@autobind
export default class MyTasks extends React.Component<IProps> {

    public componentDidMount() {
        this.props.tasksStore.getMyTasks(localStorage.getItem("userId"))
    }

    public render() {
        return (
            <div className={s.container}>
               
                <Card className={s.mainCard} containerStyle={ { height: '100%', width: '100%' } }>
               
                    <List> 
                        {this.props.tasksStore.getShowableTasks().map((task, pos) => {
                            return [
                                <ListItem
                                    key={task._id}
                                    className={task.completed ? s.completedListItem : s.listItem}
                                    primaryText={task.name}
                                    leftCheckbox={ 
                                        <Checkbox checked={task.completed} onCheck={(_, isChecked) => {this.props.tasksStore.changeCompletedStatus(task, isChecked, pos)}} /> 
                                    } 
                                    rightToggle={ <ActionDelete onClick={ () => { this.props.tasksStore.startDeleteTaskProcess(task) } } /> }
                                />,
                                pos < this.props.tasksStore.tasks.length-1 ?  <Divider key="divider"/> : null
                            ];
                        })}
                    </List>
                
                    <FloatingActionButton className={s.addFAB} onClick={ () => { this.props.tasksStore.openNewTaskDialog() } } >
                        <ContentAdd />
                    </FloatingActionButton>
               
                </Card>
                
                <CreateTaskDialog 
                    open={this.props.tasksStore.isCreateTaskDialogOpen}
                />

                <Snackbar
                    open={this.props.tasksStore.isUndoDeleteSnackBarOpen}
                    message="Task deleted"
                    action="Undo"
                    autoHideDuration={3000}
                    onActionTouchTap={() => { this.props.tasksStore.undoLastDeletion() } }
                    onRequestClose={() => { this.props.tasksStore.actualDeleteTasks() } } 
                />

            </div>
        );
    }
}