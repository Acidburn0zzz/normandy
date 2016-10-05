import React, { PropTypes as pt } from 'react';
import { reduxForm } from 'redux-form';
import HeartbeatForm, { HeartbeatFormFields } from './action_forms/HeartbeatForm.js';
import ConsoleLogForm, { ConsoleLogFormFields } from './action_forms/ConsoleLogForm.js';
import ShieldStudyForm, { ShieldStudyFormFields } from './action_forms/ShieldStudyForm.js';

export function DisconnectedActionForm({ fields, ChildForm }) {
  return (
    <div id="action-configuration">
      <i className="fa fa-caret-up fa-lg" />
      <ChildForm fields={fields} />
    </div>
  );
}
DisconnectedActionForm.propTypes = {
  fields: pt.object.isRequired,
  ChildForm: pt.child,
};

export default reduxForm({
  form: 'action',
}, (state, props) => {
  let initialValues = {};
  let fields = [];
  let ChildForm = null;

  switch (props.name) {
    case 'show-heartbeat':
      ChildForm = HeartbeatForm;
      fields = HeartbeatFormFields;
      break;

    case 'console-log':
      ChildForm = ConsoleLogForm;
      fields = ConsoleLogFormFields;
      break;

    case 'shield-study':
      ChildForm = ShieldStudyForm;
      fields = ShieldStudyFormFields;
      break;

    default:
      throw new Error(`Unexpected action name: "${props.name}"`);
  }

  if (props.recipe && props.recipe.action === props.name) {
    initialValues = props.recipe.arguments;
  }

  return {
    initialValues,
    fields,
    ChildForm,
  };
})(DisconnectedActionForm);
