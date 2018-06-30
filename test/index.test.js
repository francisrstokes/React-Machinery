import React from 'react';
import { mount} from 'enzyme';
import {StateMachine} from '../src';
import {
  State1Component,
  State2Component,
  State3Component,
} from './mock-components';
import configureTests from './configure-tests';

const promisify = (fn, ctx = null) => (...args) => new Promise(resolve => {
  fn.apply(ctx, [...args, resolve]);
});

configureTests();

test('Render a valid state', () => {
  const data = {};
  const state = 'state-1';

  const states = [
    {
      name: 'state-1',
      transitions: [],
      component: State1Component
    }
  ];

  const stateMachine = mount(
    <StateMachine
      getCurrentState={() => state}
      setNewState={() => {}}
      data={data}
      states={states}
    />
  );
  expect(stateMachine.text()).toEqual('State 1');
});

test('Render a valid state (render prop)', () => {
  const data = {};
  const state = 'state-1';

  const states = [
    {
      name: 'state-1',
      transitions: [],
      render: stateName => <div>Hello, {stateName}</div>
    }
  ];

  const stateMachine = mount(
    <StateMachine
      getCurrentState={() => state}
      setNewState={() => {}}
      data={data}
      states={states}
    />
  );
  expect(stateMachine.text()).toEqual('Hello, state-1');
});

test('Throw on an invalid state', () => {
  spyOn(console, 'error');
  const data = {};
  const state = 'state-2';

  const states = [
    {
      name: 'state-1',
      transitions: [],
      component: State1Component
    }
  ];

  expect(() => {
    mount(
      <StateMachine
        getCurrentState={() => state}
        setNewState={() => {}}
        data={data}
        states={states}
      />
    );
  }).toThrow();
});

test('Transition from one state to another', async () => {
  const data = { a: 1 };
  let state = 'state-1';

  const states = [
    {
      name: 'state-1',
      transitions: [
        {
          test: ({a}) => a === 2,
          newState: 'state-2'
        }
      ],
      component: State1Component
    },
    {
      name: 'state-2',
      transitions: [],
      component: State2Component
    }
  ];

  const getCurrentState = () => state;
  const setNewState = newState => state = newState;

  let stateMachine = mount(
    <StateMachine
      getCurrentState={getCurrentState}
      setNewState={setNewState}
      data={data}
      states={states}
    />
  );

  expect(stateMachine.text()).toEqual('State 1');

  const setProps = promisify(stateMachine.setProps, stateMachine);

  // First new props cause a call to setNewState()
  await setProps({
    getCurrentState,
    setNewState,
    data: {...data, a: 2},
    states,
  });

  // Second set props forces another render in tests
  await setProps({
    getCurrentState,
    setNewState,
    data: {a: 2},
    states,
  });

  expect(stateMachine.text()).toEqual('State 2');
});

test('Throw when transitioning from one state to an invalid one', async () => {
  spyOn(console, 'error');
  const data = { a: 1 };
  let state = 'state-1';

  const states = [
    {
      name: 'state-1',
      transitions: [
        {
          test: ({a}) => a === 2,
          newState: 'state-3'
        }
      ],
      component: State1Component
    },
    {
      name: 'state-2',
      transitions: [],
      component: State2Component
    }
  ];

  const getCurrentState = () => state;
  const setNewState = newState => state = newState;

  let stateMachine = mount(
    <StateMachine
      getCurrentState={getCurrentState}
      setNewState={setNewState}
      data={data}
      states={states}
    />
  );

  expect(stateMachine.text()).toEqual('State 1');

  expect(() => {
    stateMachine.setProps({
      getCurrentState,
      setNewState,
      data: {a: 2},
      states,
    })
  }).toThrow();
});

test('Transition from one state to another when presented with multiple options', async () => {
  const data = { a: 1, b: 1 };
  let state = 'state-1';

  const states = [
    {
      name: 'state-1',
      transitions: [
        {
          test: ({a}) => a === 2,
          newState: 'state-2'
        },
        {
          test: ({b}) => b === 2,
          newState: 'state-3'
        }
      ],
      component: State1Component
    },
    {
      name: 'state-2',
      transitions: [],
      component: State2Component
    },
    {
      name: 'state-3',
      transitions: [],
      component: State3Component
    }
  ];

  const getCurrentState = () => state;
  const setNewState = newState => state = newState;

  let stateMachine = mount(
    <StateMachine
      getCurrentState={getCurrentState}
      setNewState={setNewState}
      data={data}
      states={states}
    />
  );

  expect(stateMachine.text()).toEqual('State 1');

  const setProps = promisify(stateMachine.setProps, stateMachine);

  // First new props cause a call to setNewState()
  await setProps({
    getCurrentState,
    setNewState,
    data: {...data, b: 2},
    states,
  });

  // Second set props forces another render in tests
  await setProps({
    getCurrentState,
    setNewState,
    data: {b: 2},
    states,
  });

  expect(stateMachine.text()).toEqual('State 3');
});

