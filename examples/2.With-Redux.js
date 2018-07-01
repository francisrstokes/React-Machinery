import {StateMachine} from 'react-machinery';
import {connect} from 'react-redux';

/*
  This example uses a redux connected component to provide data to the State Machine.
  Updating the state is done by dispatching an action so that the
  current state is also kept in the store.

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
    transitions: [
      {
        test: n => n === 2,
        newState: 'theNumberTwo'
      }
    ],
    component: <One/>
  },
  {
    name: 'theNumberTwo',
    transitions: [
      {
        test: n => n === 1,
        newState: 'theNumberOne'
      },
      {
        test: n => n === 10,
        newState: 'theNumberTen'
      },
    ],
    component: <Two/>
  },
  {
    name: 'theNumberTen',
    transitions: [
      {
        test: n => n === 1,
        newState: 'theNumberOne'
      },
      {
        test: n => n === 42,
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

export const Example = connect(
  state => ({
    n: state.n,
    currentState: state.currentState
  }),
  dispatch => ({
    setNewState: (stateName) => dispatch({
      type: 'SET_NEW_STATE',
      payload: stateName
    }),
    updateN: (newValue) => dispatch({
      type: 'UPDATE_N_VALUE',
      payload: newValue
    })
  })
)(({n, currentState, setNewState, updateN}) => {
  return <div>
    <StateMachine
      getCurrentState={() => currentState}
      setNewState={setNewState}
      data={n}
      states={states}
    />

    <div>{n}</div>

    <button onClick={() => updateN(n + 1)}>+1</button>
    <button onClick={() => updateN(n + 10)}>+10</button>
    <button onClick={() => updateN(n - 1)}>-1</button>
    <button onClick={() => updateN(n - 10)}>-10</button>
  </div>;
})
