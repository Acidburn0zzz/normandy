import React from 'react'
import { reduxForm } from 'redux-form'
import { _ } from 'underscore'
import { formatLabel } from '../../utils/formHelpers.js'


class SurveyForm extends React.Component {
  render() {
    const { selectedSurvey, fields, setSelectedSurvey } = this.props;
    const surveyObject = selectedSurvey || fields.defaults;
    let headerText = 'Default Survey Values';
    let containerClass = 'fluid-8';
    if (selectedSurvey) {
      headerText = selectedSurvey.title.initialValue || 'New survey';
      containerClass += ' active';
    }

    return (
      <div id='survey-form' className={containerClass}>
        { selectedSurvey &&
          <span className="return-to-defaults" onClick={setSelectedSurvey.bind(this, null)}>
            <i className="fa fa-long-arrow-left pre"></i> Return to defaults
          </span>
        }
        <h4>{headerText}</h4>
        {
          Object.keys(surveyObject).map(fieldName =>
            <div key={fieldName} className="row">
              <label>{formatLabel(fieldName)}</label>
              <input type="text" field={surveyObject[fieldName]} {...surveyObject[fieldName]} />
            </div>
          )
        }
      </div>
    )
  }
}

class HeartbeatForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedSurvey: null }
    this.setSelectedSurvey = this.setSelectedSurvey.bind(this);
  }

  setSelectedSurvey(survey) {
    this.setState({ selectedSurvey: survey || null });
  }

  addSurvey(event) {
    event.preventDefault();
    this.props.fields.surveys.addField();
  }

  deleteSurvey(index, event) {
    event.stopPropagation();
    this.props.fields.surveys.removeField(index);
    this.setSelectedSurvey();
  }

  render() {
    const { fields, setSelectedSurvey } = this.props;
    const { selectedSurvey } = this.state;
    return (
      <div className="row">
        <div className="fluid-4">
          <div className="row">
            <label>Survey ID</label>
            <input type="text" field={fields.surveyId} {...fields.surveyId} />
          </div>
          <div className="row array-field">
            <h4>Surveys</h4>

            <a className="button add-field" onClick={this.addSurvey.bind(this)}><i className="fa fa-plus"></i> Add Survey</a>

            { fields.surveys.length ?
              <ul>
                {
                  fields.surveys.map((survey, index) =>
                    <li key={index} className={_.isEqual(survey, selectedSurvey) ? 'active' : ''} onClick={this.setSelectedSurvey.bind(this, survey)}>
                      { survey.title.value || "Untitled Survey" }
                      <span title="Delete this survey" className="delete-field" onClick={this.deleteSurvey.bind(this, index)}>
                        <i className="fa fa-times red"></i>
                      </span>
                    </li>
                  )
                }
              </ul> : ' - No surveys'
            }
          </div>
        </div>
        <div className="fluid-4 float-right">
          <SurveyForm selectedSurvey={selectedSurvey} fields={fields} setSelectedSurvey={this.setSelectedSurvey} />
        </div>
      </div>
    )
  }
}

export default HeartbeatForm;
