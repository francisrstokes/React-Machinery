import React from "react";
import PropTypes from "prop-types";

export class StateMachine extends React.Component {
  constructor(props) {
    super(props);
    this.transition('<no state>', this.props.getCurrentState());
    this.update();
  }

  transition(oldState, newState) {
    const nextState = this.props.states.find(state => state.name === newState);
    if (!nextState) {
      const validStates = this.props.states.map(state => state.name).join(", ");
      throw new Error(
        `Tried to transition from state '${oldState}' to '${newState}'. Valid states are: [${validStates}]`
      );
    }

    this.props.setNewState(newState);

    if (nextState.effect) {
      nextState.effect({
        ...this.props.data,
        currentState: newState,
        transitionTo: this.createTransitionToFn(nextState),
      });
    }
  }

  update() {
    const { getCurrentState, states, data } = this.props;
    const currentStateName = getCurrentState();
    const currentState = states.find(state => state.name === currentStateName);

    if (Array.isArray(currentState.autoTransitions)) {
      for (const transition of currentState.autoTransitions) {
        if (transition.test(data)) {
          this.transition(currentStateName, transition.newState);
          return;
        }
      }
    }
  }

  componentDidUpdate() {
    this.update();
  }

  createTransitionToFn = currentState => newState => {
    if (!(currentState.validTransitions && currentState.validTransitions.includes(newState))) {
      throw new Error(
        `'${newState}' is not listed in transitions array for state ${currentState.name}`
      );
    }
    this.transition(currentState.name, newState);
  }

  render() {
    const currentStateName = this.props.getCurrentState();
    const currentState = this.props.states.find(
      state => state.name === currentStateName
    );

    const additionalProps = {
      ...this.props.data,
      currentState: currentStateName,
      transitionTo: this.createTransitionToFn(currentState),
    };

    if (currentState.render) return currentState.render(additionalProps);
    if (currentState.component) return React.createElement(currentState.component, additionalProps);

    throw new Error(
      `Neither a valid render or component property was found for state '${currentStateName}'`
    );
  }
}

const autoTransitionsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    test: PropTypes.func.isRequired,
    newState: PropTypes.string.isRequired
  })
);

const statePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    autoTransitions: autoTransitionsPropTypes,
    validTransitions: PropTypes.arrayOf(PropTypes.string),

    effect: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    render: PropTypes.func
  })
).isRequired;

StateMachine.propTypes = {
  data: PropTypes.object.isRequired,
  getCurrentState: PropTypes.func.isRequired,
  setNewState: PropTypes.func.isRequired,
  states: statePropTypes,
};
