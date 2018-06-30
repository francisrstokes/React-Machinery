# React Machinery

[![npm version](https://badge.fury.io/js/react-machinery.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![CircleCI](https://circleci.com/gh/francisrstokes/React-Machinery.png?circle-token=46dc2a2f9571dfc783c03c6550c3119c18c5b8ce&style=shield)]()


⚙️ State Machine Modelling for React

- [Description](#description)
  - [Example](#example)
- [Installation](#installation)

## Description

🔥 `React Machinery` provides a simple to use, component based approach to state machines in react.

Describe your states, transitions, and which component each renders, and plug it into the `StateMachine` component. It accepts two extra functions; one for getting the current state name and one for setting it. This allows your app to flexibly use and swap out different ways of storing data - be it in component state, redux, mobx, whatever.

### Example

```javascript
const states = [
  {
    name: 'theNumberOne',
    transitions: [
      {
        test: specialNumber => specialNumber === 2,
        newState: 'theNumberTwo'
      }
    ],
    component: <One/>
  },
  {
    name: 'theNumberTwo',
    transitions: [
      {
        test: specialNumber => specialNumber === 1,
        newState: 'theNumberOne'
      },
      {
        test: specialNumber => specialNumber === 10,
        newState: 'theNumberTen'
      },
    ],
    component: <Two/>
  },
  {
    name: 'theNumberTen',
    transitions: [
      {
        test: specialNumber => specialNumber === 1,
        newState: 'theNumberOne'
      },
      {
        test: specialNumber => specialNumber === 42,
        newState: 'lifeTheUniverseAndEverything'
      }
    ],
    component: <Ten/>
  },
  {
    name: 'lifeTheUniverseAndEverything',
    transitions: [],
    component: <HitchHikerComponent/>
  },
];

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      specialNumber: 1,
      stateName: 'theNumberOne'
    };
  }

  render() {
    return <div>
      <StateMachine
        getCurrentState={() => this.state.stateName}
        setNewState={stateName => this.setState(() => ({ stateName }))}
        data={this.state.specialNumber}
        states={states}
      />

      <div>{this.state.specialNumber}</div>

      <button onClick={() => this.setState(() => ({specialNumber: this.state.specialNumber + 1}))}>+1</button>
      <button onClick={() => this.setState(() => ({specialNumber: this.state.specialNumber + 10}))}>+10</button>
      <button onClick={() => this.setState(() => ({specialNumber: this.state.specialNumber - 1}))}>-1</button>
      <button onClick={() => this.setState(() => ({specialNumber: this.state.specialNumber - 10}))}>-10</button>
    </div>;
  }
}
```

The above example represents the following state diagram:

![State diagram of code above](StateDiagram.png)

While not a particularly complex set of states, it illustrates how `React Machinery` can be used to create predictable and bug free flows. Notice that it is simply not possible to get to the `lifeTheUniverseAndEverything` state from anything but the `theNumberTen` state.

## Installation

```bash
# with yarn
yarn add react-machinery

# or with npm
npm i react-machinery
```
