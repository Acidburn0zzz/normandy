import controlAppReducer from '../../reducers/ControlAppReducer';
import * as actions from '../../actions/ControlActions';
import { fixtureRecipes, initialState } from '../fixtures.js';

describe('controlApp reducer', () => {
  it('should return initial state by default', () => {
    expect(controlAppReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle REQUEST_IN_PROGRESS', () => {
    expect(controlAppReducer(undefined, {
      type: actions.REQUEST_IN_PROGRESS,
    })).toEqual({
      ...initialState,
      isFetching: true,
    });
  });

  it('should handle REQUEST_COMPLETE', () => {
    expect(controlAppReducer(undefined, {
      type: actions.REQUEST_COMPLETE,
    })).toEqual({
      ...initialState,
      isFetching: false,
    });
  });

  it('should handle RECIPES_RECEIVED', () => {
    expect(controlAppReducer(undefined, {
      type: actions.RECIPES_RECEIVED,
      recipes: fixtureRecipes,
    })).toEqual({
      ...initialState,
      recipes: fixtureRecipes,
      recipeListNeedsFetch: false,
    });
  });

  it('should handle SINGLE_RECIPE_RECEIVED', () => {
    expect(controlAppReducer(undefined, {
      type: actions.SINGLE_RECIPE_RECEIVED,
      recipe: fixtureRecipes[0],
    })).toEqual({
      ...initialState,
      recipes: [fixtureRecipes[0]],
      recipeListNeedsFetch: true,
      selectedRecipe: 1,
    });
  });

  it('should handle SET_SELECTED_RECIPE', () => {
    expect(controlAppReducer(undefined, {
      type: actions.SET_SELECTED_RECIPE,
      recipeId: 2,
    })).toEqual({
      ...initialState,
      selectedRecipe: 2,
    });
  });

  it(`
    should append notifications to the notification list for the
    SHOW_NOTIFICATION action
  `, () => {
    const notification = {
      messageType: 'success',
      message: 'Success message',
      id: 5,
    };

    expect(controlAppReducer(undefined, {
      type: actions.SHOW_NOTIFICATION,
      notification,
    })).toEqual({
      ...initialState,
      notifications: [notification],
    });
  });

  describe('DISMISS_NOTIFICATION', () => {
    const notification1 = { messageType: 'success', message: 'message1', id: 1 };
    const notification2 = { messageType: 'success', message: 'message2', id: 2 };
    const startState = {
      ...initialState,
      notifications: [notification1, notification2],
    };

    it('should remove matching notifications from the notification list', () => {
      expect(
        controlAppReducer(startState, {
          type: actions.DISMISS_NOTIFICATION,
          notificationId: notification1.id,
        })
      ).toEqual({
        ...initialState,
        notifications: [notification2],
      });
    });

    it('should not remove any notifications when an invalid id is given', () => {
      expect(
        controlAppReducer(startState, { type: actions.DISMISS_NOTIFICATION, id: 99999 })
      ).toEqual({
        ...initialState,
        notifications: [notification1, notification2],
      });
    });
  });

  it('should handle RECIPE_ADDED', () => {
    expect(controlAppReducer(initialState, {
      type: actions.RECIPE_ADDED,
      recipe: {
        id: 4,
        name: 'Villis stebulum',
        enabled: false,
      },
    })).toEqual({
      ...initialState,
      recipes: [{
        id: 4,
        name: 'Villis stebulum',
        enabled: false,
      }],
    });
  });

  it('should handle RECIPE_UPDATED', () => {
    expect(controlAppReducer({ recipes: fixtureRecipes }, {
      type: actions.RECIPE_UPDATED,
      recipe: {
        id: 3,
        name: 'Updated recipe name',
        enabled: true,
      },
    })).toEqual({
      recipes: [{
        id: 1,
        name: 'Lorem Ipsum',
        enabled: true,
      },
      {
        id: 2,
        name: 'Dolor set amet',
        enabled: true,
      },
      {
        id: 3,
        name: 'Updated recipe name',
        enabled: true,
      }],
    });
  });

  it('should handle RECIPE_DELETED', () => {
    expect(controlAppReducer({ recipes: fixtureRecipes }, {
      type: actions.RECIPE_DELETED,
      recipeId: 3,
    })).toEqual({
      recipes: [{
        id: 1,
        name: 'Lorem Ipsum',
        enabled: true,
      },
      {
        id: 2,
        name: 'Dolor set amet',
        enabled: true,
      }],
    });
  });
});
