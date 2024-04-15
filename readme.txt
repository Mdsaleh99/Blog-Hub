
explain state, action and action.payload 
State:

State represents the entire application's data at a given point in time. It is typically stored in a single JavaScript object called the Redux store.
The state object is immutable, meaning it cannot be changed directly. Instead, changes to the state are made by dispatching actions.
Actions:

Actions are plain JavaScript objects that describe an intention to change the state. They are the only source of information for the store.
An action object must have a type property, which is a string that describes the type of action being performed.
Actions can also carry additional data, known as the action payload, which provides information necessary to perform the state update.
Action Payload:

The action payload is an optional property of an action object that contains any additional data needed to perform the state update.
It is typically named payload, but you can use any other name as well.
The payload can be of any data type, such as a string, number, object, or array, depending on the specific requirements of the action.
Here's how these concepts work together in Redux:

When you want to update the state, you create an action object with a specific type and an optional payload.
You then dispatch the action to the Redux store using the dispatch function provided by Redux.
The Redux store receives the action and passes it to the root reducer.
The root reducer, along with any other combined reducers, determines how to update the state based on the action type and, if necessary, the payload.
The updated state is returned from the root reducer and stored in the Redux store.
Components subscribed to changes in the Redux store receive the updated state and re-render accordingly.

-------------------------------------------------------------------------------------