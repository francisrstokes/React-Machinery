import {StateMachine} from 'react-machinery';

/*
  This example uses a regular react component as the data store for our state machine.
  Updating the state is as simple as passing a function that calls setState on our component.

  At any time, we can be in one of four states:
    - theNumberOne
    - theNumberTwo
    - theNumberTen
    - lifeTheUniverseAndEverything

  We can only transition to some states if we are already in a certain state. For example,
  'theNumberTen' can only be transitioned if we are already in 'theNumberTwo'.
*/

const One = () => <div>State #1</div>
const Two = () => <div>State #2</div>
const Ten = () => <div>State #10</div>
const HitchHikerComponent = () => <div>Theres a frood who really knows where his towel is.</div>

const states = [
  {
    name: 'theNumberOne',
    autoTransitions: [
      {
        test: ({n}) => n === 2,
        newState: 'theNumberTwo'
      }
    ],
    component: One
  },
  {
    name: 'theNumberTwo',
    autoTransitions: [
      {
        test: ({n}) => n === 1,
        newState: 'theNumberOne'
      },
      {
        test: ({n}) => n === 10,
        newState: 'theNumberTen'
      },
    ],
    component: Two
  },
  {
    name: 'theNumberTen',
    autoTransitions: [
      {
        test: ({n}) => n === 1,
        newState: 'theNumberOne'
      },
      {
        test: ({n}) => n === 42,
        newState: 'lifeTheUniverseAndEverything'
      }
    ],
    component: Ten
  },
  {
    name: 'lifeTheUniverseAndEverything',
    component: HitchHikerComponent
  },
];

export class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 1,
      stateName: 'theNumberOne'
    };
  }

  render() {
    const {n} = this.state;
    return <div>
      <StateMachine
        getCurrentState={() => this.state.stateName}
        setNewState={stateName => this.setState(() => ({ stateName }))}
        data={{n}}
        states={states}
      />

      <div>{n}</div>

      <button onClick={() => this.setState(() => ({n: n + 1}))}>+1</button>
      <button onClick={() => this.setState(() => ({n: n + 10}))}>+10</button>
      <button onClick={() => this.setState(() => ({n: n - 1}))}>-1</button>
      <button onClick={() => this.setState(() => ({n: n - 10}))}>-10</button>
    </div>;
  }
}