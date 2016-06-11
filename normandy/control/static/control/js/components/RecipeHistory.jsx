import React from 'react'
import { push } from 'react-router-redux'
import moment from 'moment'
import composeRecipeContainer from './RecipeContainer.jsx'
import apiFetch from '../utils/apiFetch.js';

class RecipeHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revisionLog: []
    }
  }

  getHistory(recipeId) {
    apiFetch(`/api/v1/recipe/${recipeId}/history/`)
      .then(response => {
        this.setState({
          revisionLog: response.reverse()
        })
      });
  }

  componentDidMount() {
    const { recipeId } = this.props;
    this.getHistory(recipeId);
  }

  render() {
    const { revisionLog } = this.state;
    const { recipeId, recipe, dispatch } = this.props;
    return (
      <div className="fluid-8">
        <h3>Viewing revision log for: <b>{recipe ? recipe.name : ''}</b></h3>
        <ul>
            {
              this.state.revisionLog.map((revision, index) =>
                <li key={revision.date_created} onClick={(e) => {
                  let revisionInfo = {};
                  if (index !== 0) {
                    revisionInfo = {
                      query: { revisionId: `${revision.id}` },
                      state: { selectedRevision: revision.recipe }
                    }
                  }
                  dispatch(push({
                    pathname: `/control/recipe/${recipeId}/`,
                    ...revisionInfo
                  }))
                }}><p className="revision-number">#{revision.recipe.revision_id} </p>
                  <p><span className="label">Created On:</span>{ moment(revision.date_created).format('MMM Do YYYY - h:mmA') }</p>
                </li>
              )
            }
        </ul>
      </div>
    )
  }
}

export default composeRecipeContainer(RecipeHistory);
