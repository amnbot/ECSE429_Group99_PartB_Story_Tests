const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

const baseUrl = 'http://localhost:4567';

When('I send a {string} request to {string}', async function (method, endpoint) {
  const url = `${baseUrl}${endpoint}`;
  const config = { headers: { 'Content-Type': 'application/json' } };

  try {
    if (method.toLowerCase() === 'delete') {
      this.response = await axios.delete(url, config);
    } else if (method.toLowerCase() === 'get') {
      this.response = await axios.get(url, config);
    } else {
      throw new Error(`Unsupported HTTP method without data: ${method}`);
    }
  } catch (error) {
    this.response = error.response || error;
  }
});

Then('the project with id {string} should no longer reference todo {string}', async function (projectId, todoId) {
  const response = await axios.get(`${baseUrl}/projects/${projectId}/tasks`);
  let tasks = response.data;
  
  if (!Array.isArray(tasks)) {
    if (tasks && typeof tasks === 'object') {
      tasks = [tasks];
    } else {
      tasks = [];
    }
  }
  
  const found = tasks.some(task => task && task.id && task.id.toString() === todoId);
  assert.ok(!found, `Project with id ${projectId} still references todo ${todoId}`);
});