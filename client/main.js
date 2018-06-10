import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import '../imports/startup/Accounts-Config';
import App from '../imports/ui/App';

Meteor.startup(() => {
    ReactDOM.render(<App />, document.getElementById('render-target'));
})