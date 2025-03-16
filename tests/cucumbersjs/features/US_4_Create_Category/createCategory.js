const { Then } = require('@cucumber/cucumber');
const assert = require('assert');

Then('the returned category should have a generated id', function () {
  const category = this.response.data;
  assert.ok(category.id, 'Expected category to have a generated id');
});

Then('the returned category should have the title {string}', function (expectedTitle) {
  const category = this.response.data;
  assert.strictEqual(
    category.title,
    expectedTitle,
    `Expected title "${expectedTitle}" but got "${category.title}"`
  );
});

Then('the returned category should have the description {string}', function (expectedDescription) {
  const category = this.response.data;
  // If description is undefined, treat it as an empty string.
  const actualDescription = category.description || "";
  assert.strictEqual(
    actualDescription,
    expectedDescription,
    `Expected description "${expectedDescription}" but got "${actualDescription}"`
  );
});
