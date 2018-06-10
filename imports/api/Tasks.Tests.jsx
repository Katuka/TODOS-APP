import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Tasks } from './Tasks';

if(Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;

            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'fwebene',
                });
            });
            it('can delete owned task', () => {
                const deleteTask = Meteor.isServer.method_handlers['tasks.remove'];
                const invocation = { userId };
                deleteTask.apply(invocation, [taskId]);
                assert.equal(Tasks.find().count(), 0);
            });
        });
    });
}