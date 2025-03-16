const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

const baseUrl = 'http://localhost:4567';

Given('the API is running', async function () {
  try {
    this.response = await axios.get(`${baseUrl}/todos`);
    assert.ok(
      this.response.status === 200 || this.response.status === 404,
      `Unexpected status: ${this.response.status}`
    );
  } catch (error) {
    this.response = error.response || error;
  }
});

When('I send a {string} request to {string} with the following data:', async function (method, endpoint, dataTable) {
  let requestData = {};
  const rows = dataTable.hashes();
  const raw = dataTable.raw();

  if (rows.length > 0) {
    requestData = rows[0];
  } else if (raw.length === 1 && raw[0].length === 2) {
    requestData[raw[0][0]] = raw[0][1];
  } else if (raw.length >= 2 && raw[0].length === 1) {
    requestData[raw[0][0]] = raw[1][0];
  } else if (raw.length >= 1 && raw[0].length === 2) {
    requestData = dataTable.rowsHash();
  } else {
    throw new Error('Data table wrong format');
  }

  if (Object.prototype.hasOwnProperty.call(requestData, 'doneStatus') && requestData.doneStatus !== '') {
    requestData.doneStatus = requestData.doneStatus.toLowerCase() === 'true';
  }

  if (Object.prototype.hasOwnProperty.call(requestData, 'completed') && requestData.completed !== '') {
    const val = requestData.completed.toLowerCase();
    if(val === 'true' || val === 'false'){
      requestData.completed = (val === 'true');
    }
  }
  if (Object.prototype.hasOwnProperty.call(requestData, 'active') && requestData.active !== '') {
    const val = requestData.active.toLowerCase();
    if(val === 'true' || val === 'false'){
      requestData.active = (val === 'true');
    }
  }

  // Process placeholders
  for (const key in requestData) {
    if (typeof requestData[key] === 'string' && requestData[key].startsWith('{{') && requestData[key].endsWith('}}')) {
      const varName = requestData[key].substring(2, requestData[key].length - 2);
      if (this[varName] !== undefined) {
        requestData[key] = this[varName];
        console.log(`Replaced placeholder {{${varName}}} with actual value: ${requestData[key]}`);
      }
    }
  }

  const url = `${baseUrl}${endpoint}`;
  const config = { headers: { 'Content-Type': 'application/json' } };

  console.log(`${method}\t\t${url}\t\t`, requestData);
  
  try {
    if (method.toLowerCase() === 'post') {
      this.response = await axios.post(url, requestData, config);
    } else if (method.toLowerCase() === 'put') {
      this.response = await axios.put(url, requestData, config);
    } else if (method.toLowerCase() === 'delete') {
      this.response = await axios.delete(url);
    } else if (method.toLowerCase() === 'get') {
      this.response = await axios.get(url);
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    this.response = error.response || error;
  }

  console.log(`Response status: ${this.response.status}`);
  console.log(`Response data: ${JSON.stringify(this.response.data, null, 2)}`);
});

Then('the response status should be {int}', function (expectedStatus) {
  assert.strictEqual(
    this.response.status,
    expectedStatus,
    `Expected status ${expectedStatus} but got ${this.response.status}`
  );
});

Then('the returned todo item should have the title {string}', function (expectedTitle) {
  const todo = this.response.data;
  assert.strictEqual(
    todo.title,
    expectedTitle,
    `Expected title "${expectedTitle}" but got "${todo.title}"`
  );
});

Then('the returned todo item should have doneStatus {string}', function (expectedDoneStatus) {
  const todo = this.response.data;
  const actualDoneStatus = todo.doneStatus ? todo.doneStatus.toString() : 'false';
  assert.strictEqual(
    actualDoneStatus,
    expectedDoneStatus,
    `Expected doneStatus "${expectedDoneStatus}" but got "${actualDoneStatus}"`
  );
});

Then('the returned todo item should have the description {string}', function (expectedDescription) {
  const todo = this.response.data;
  assert.strictEqual(
    todo.description,
    expectedDescription,
    `Expected description "${expectedDescription}" but got "${todo.description}"`
  );
});

Then('the response should contain a valid todo item with a generated id', function () {
  const todo = this.response.data;
  assert.ok(todo.id, 'Expected a valid id');
});

Then('the error message should indicate that the title is required', function () {
  let errorMessages = this.response.data.errorMessages;
  
  const combined = errorMessages.join(' ');
  assert.ok(
    combined.toLowerCase().includes('title'),
    `Expected error message to mention that the title is required, but got "${combined}"`
  );
});

Then('the error message should correspond to:', function (docString) {
  const expected = JSON.parse(docString);
  const actual = (this.response && this.response.data && this.response.data.errorMessages) || [];
  assert.deepStrictEqual(
    actual,
    expected.errorMessages,
    `Expected errorMessages ${JSON.stringify(expected.errorMessages)} but got ${JSON.stringify(actual)}`
  );
});

module.exports = { baseUrl };
