import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Task from './Task.jsx';
import { Tasks } from '../api/Tasks';
import AccountsUIWrapper from './AccountsUIWrapper';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        // Tasks.insert({
        //     text,
        //     createdAt: new Date(),
        //     owner: Meteor.userId(),
        //     username: Meteor.user().username,
        // });
        Meteor.call('tasks.insert', text)

        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted = () => {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }



    renderTasks = () => {

        let filteredTasks = this.props.tasks;
        if(this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            const currentUseId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUseId;

            return (
                <Task key={task._id} task={task} showPrivateButton={showPrivateButton}/>
            );
        });
    }

    render() {
        return (
            <div id="boxshadow">
                <div className="container">
                    <header>
                        <h1>Todo List</h1>
                        <span>
                            <label htmlFor="check">
                                <input type="checkbox"
                                    readOnly
                                    checked={this.state.hideCompleted}
                                    onClick={this.toggleHideCompleted}
                                    id="check"
                                />
                                Hide Completed Tasks
                            </label>

                            {/* ACCOUNTS COMPONENT */}
                            <AccountsUIWrapper />
                        </span> <br/>
                        <small>You have now ({this.props.incompleteCount}) incomplete tasks.</small>

                        { this.props.currentUser ? 
                            <form className="new-tast" onSubmit={this.handleSubmit}>
                            <input type="text"
                            ref="textInput"
                            placeholder="Enter a new task..."/>
                            </form> : ''
                        }
                    </header>

                    <ul>
                        {this.renderTasks()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, { sort: {createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
})(App);