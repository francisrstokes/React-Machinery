import React from "react";
import PropTypes from "prop-types";

export class StateMachine extends React.Component {
  constructor(props) {
    super(props);
    this.transition("<no state>", this.props.getCurrentState());
    this.update();
  }

  transition(oldState, newState) {
    if (!this.props.states.find(state => state.name === newState)) {
      const validStates = this.props.states.map(state => state.name).join(", ");
      throw new Error(
        `Tried to transition from state '${oldState}' to '${newState}'. Valid states are: [${validStates}]`
      );
    }
    this.props.setNewState(newState);
  }

  update() {
    const { getCurrentState, states, data } = this.props;
    const currentStateName = getCurrentState();
    const currentState = states.find(state => state.name === currentStateName);

    for (const transition of currentState.transitions) {
      if (transition.test(data)) {
        this.transition(currentStateName, transition.newState);
        return;
      }
    }
  }

  componentDidUpdate() {
    this.update();
  }

  render() {
    const currentStateName = this.props.getCurrentState();
    const currentState = this.props.states.find(
      state => state.name === currentStateName
    );

    const additionalProps = this.props.props || undefined;
    if (currentState.render) return currentState.render(currentStateName, additionalProps);
    if (currentState.component) return React.createElement(currentState.component, additionalProps);

    throw new Error(
      `Neither a valid render or component property was found for state '${currentStateName}'`
    );
  }
}

const transitionsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    test: PropTypes.func.isRequired,
    newState: PropTypes.string.isRequired
  })
);

const statePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    transitions: transitionsPropTypes,

    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    render: PropTypes.func
  })
).isRequired;

StateMachine.propTypes = {
  data: PropTypes.any.isRequired,
  getCurrentState: PropTypes.func.isRequired,
  setNewState: PropTypes.func.isRequired,
  states: statePropTypes,
  props: PropTypes.object
};
