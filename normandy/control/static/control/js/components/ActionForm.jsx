import React from 'react'
import { reduxForm } from 'redux-form'
import { _ } from 'underscore'
import HeartbeatForm from './action_forms/HeartbeatForm.jsx'
import ConsoleLogForm from './action_forms/ConsoleLogForm.jsx'

export class ActionForm extends React.Component {
  render() {
    const { fields, name } = this.props;

    let childForm = 'No action form available';

    switch(name) {
      case 'show-heartbeat':
        childForm = (<HeartbeatForm fields={fields} />);
        break;
      case 'console-log':
        childForm = (<ConsoleLogForm fields={fields} />);
        break;
    }

    return (
      <div id="action-configuration">
        <i className="fa fa-caret-up fa-lg"></i>
        {childForm}
      </div>
    )
  }
}

export default reduxForm({
    form: 'action',
  }, (state, props) => {
    let initialValues = {};
    if (props.recipe && props.recipe.action_name === props.name) {
      initialValues = props.recipe['arguments'];
    }

    return {
      initialValues
    }
})(ActionForm)
