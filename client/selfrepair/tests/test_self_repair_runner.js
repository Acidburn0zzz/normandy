import fetchMock from 'fetch-mock';

import { mockNormandy } from '../../actions/tests/utils.js';
import {
  classifyClient,
  doesRecipeMatch,
  fetchAction,
  filterContext,
  loadActionImplementation,
} from '../self_repair_runner.js';


const UUID_ISH_REGEX = /^[a-f0-9-]{36}$/;


describe('Self-Repair Runner', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('classifyClient', () => {
    it('should make a request to the normandy server', async () => {
      const url = '/api/v1/classify/';
      const requestTime = '2016-01-01';
      document.documentElement.dataset.classifyUrl = url;
      fetchMock.get(url, {
        request_time: requestTime,
        country: 'US',
      });

      expect(await classifyClient()).toEqual(jasmine.objectContaining({
        request_time: new Date(requestTime),
        country: 'US',
      }));
      expect(fetchMock.lastUrl()).toEqual(url);
    });
  });

  describe('filterContext', () => {
    it('should contain a valid user ID', async () => {
      document.documentElement.dataset.classifyUrl = '/api/v1/classify/';
      fetchMock.get('/api/v1/classify/', {
        request_time: '2016-01-01',
        country: 'US',
      });

      const driver = mockNormandy();
      const context = await filterContext(driver);
      expect(context.normandy.userId).toBeDefined();
      expect(UUID_ISH_REGEX.test(context.normandy.userId)).toBe(true);
    });
  });

  describe('doesRecipeMatch', () => {
    it('should include the recipe in the filter expression context', async () => {
      const recipe = {
        filter_expression: 'recipe.shouldPass',
        shouldPass: true,
      };

      let match = await doesRecipeMatch(recipe, {});
      expect(match[1]).toBe(true);

      // If shouldPass changes, so should the filter expression's result
      recipe.shouldPass = false;
      match = await doesRecipeMatch(recipe, {});
      expect(match[1]).toBe(false);
    });
  });

  describe('fetchAction', () => {
    it('should not make more than one request for the same action', async () => {
      const recipe = { action: 'test' };

      // Mock fetch that returns an action with an increasing number. If we
      // make more than one request, then fetchAction will return different
      // values for the same recipe.
      let id = 0;
      fetchMock.get(`/api/v1/action/${recipe.action}/`, () => {
        id++;
        return `{"mock": "action", "id": ${id}}`;
      });

      const action1Promise = fetchAction(recipe);
      const action2Promise = fetchAction(recipe);
      const action1 = await action1Promise;
      const action2 = await action2Promise;
      expect(action1).toEqual(action2);
    });
  });

  describe('loadActionImplementation', async () => {
    it('should not make more than one request for the same action', async () => {
      window.loadActionImplementationTest = 0;
      const url = (
        'data:text/javascript,registerAction("test", window.loadActionImplementationTest++)'
      );
      const action = { name: 'test', implementation_url: url };

      const impl1Promise = loadActionImplementation(action);
      const impl2Promise = loadActionImplementation(action);
      const impl1 = await impl1Promise;
      const impl2 = await impl2Promise;
      expect(impl1).toEqual(impl2);
    });
  });
});
