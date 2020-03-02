import React from 'react';
import PropTypes from 'prop-types';

import { StateMachine, statePropTypes } from './StateMachine';

export const ManagedStateMachine = ({
  data: initialData,
  states,
  children
}) => {
  const [data, setData] = useState(initialData);
  const [state, setState] = useState(states[0]);

  return (
    <React.Fragment>
      <StateMachine
        data={data}
        getCurrentState={() => state.name}
        setNewState={stateName => {
          setState(states.find(s => s.name === stateName));
        }}
        states={states}
      />
      {children(data, setData)}
    </React.Fragment>
  );
};

ManagedStateMachine.propTypes = {
  data: PropTypes.object.isRequired,
  states: statePropTypes
};
