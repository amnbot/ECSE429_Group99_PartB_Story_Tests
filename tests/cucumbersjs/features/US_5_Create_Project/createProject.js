const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const baseUrl = 'http://localhost:4567';

Then('I store the returned project id as {string}', function(variableName) {
  const projectId = this.response.data.id;
  this[variableName] = projectId;  
});

Then('the returned todo item should have the project with id {string}', async function(variableOrId) {
  let projectId = variableOrId;
  if (typeof variableOrId === 'string' && variableOrId.startsWith('{{') && variableOrId.endsWith('}}')) {
    const varName = variableOrId.substring(2, variableOrId.length - 2);
    if (this[varName] !== undefined) {
      projectId = this[varName];
      console.log(`Using projectId ${projectId} from variable ${varName}`);
    }
  }
  
  try {
    const todoResponse = await axios.get(`${baseUrl}/todos/1`);
    console.log(`Fetched todo: ${JSON.stringify(todoResponse.data)}`);
    
    const todo = todoResponse.data.todos ? todoResponse.data.todos[0] : todoResponse.data;
    
    const tasksof = todo.tasksof || [];
    
    assert.ok(
      tasksof.some(project => project.id === projectId),
      `Expected todo item associated with project ID ${projectId}, but wasn't found in ${JSON.stringify(tasksof)}`
    );
  } catch (error) {
    console.error('Error fetching todo:', error.message);
    throw new Error(`Failed to verify project association: ${error.message}`);
  }
});

Then('the response should contain a valid project with a generated id', function () {
  const project = this.response.data;
  assert.ok(project.id, 'Expected project to have a generated id');
});

Then('the returned project should have the title {string}', function (expectedTitle) {
  const project = this.response.data;
  assert.strictEqual(
    project.title,
    expectedTitle,
    `Expected title "${expectedTitle}" but got "${project.title}"`
  );
});

Then('the returned project should have the description {string}', function (expectedDescription) {
  const project = this.response.data;
  const actualDescription = project.description || "";
  assert.strictEqual(
    actualDescription,
    expectedDescription,
    `Expected description "${expectedDescription}" but got "${actualDescription}"`
  );
});

Then('the returned project should have completed {string}', function (expectedCompleted) {
  const project = this.response.data;
  const actualCompleted = project.completed ? project.completed.toString() : 'false';
  assert.strictEqual(
    actualCompleted,
    expectedCompleted,
    `Expected completed "${expectedCompleted}" but got "${actualCompleted}"`
  );
});

Then('the returned project should have active {string}', function (expectedActive) {
  const project = this.response.data;
  const actualActive = project.active ? project.active.toString() : 'false';
  assert.strictEqual(
    actualActive,
    expectedActive,
    `Expected active "${expectedActive}" but got "${actualActive}"`
  );
});
