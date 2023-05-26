const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("iconv-lite").encodingExists("foo");
const tableSortJs = require("../public/table-sort");

function createTestTableNoMissingTags(testTableData, classTags = "") {
  let getClassTagsForTH = [];
  let testTableThRow = `<tr><th class="${classTags}">Testing Column</th></tr>`;
  getClassTagsForTH.push(testTableThRow);

  let testTableTdRows = [];
  for (let i = 0; i < testTableData.length; i++) {
    let testTableTdRow = `<tr><td>${testTableData[i]}</td></tr>`;
    testTableTdRows.push(testTableTdRow);
  }

  const tableWithHeadAndBody = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort">
      <thead>
        ${getClassTagsForTH}
      </thead>
    <tbody>
    ${testTableTdRows}
    </tbody>
  </table> 
  </body>
  </html>`);

  // Call tablesort and make table sortable and simulate click from a user.
  tableSortJs((testing = true), tableWithHeadAndBody.window.document);
  tableWithHeadAndBody.window.document.querySelector("table th").click();
  // Make an array from table contents to test if sorted correctly.
  let table = tableWithHeadAndBody.window.document.querySelector("table");
  const tableBody = table.querySelector("tbody");
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const testIfSortedList = tableRows.map(
    (tr) => tr.querySelectorAll("td").item(0).innerHTML
  );
  return testIfSortedList;
}

function createTestTableMissingHeadTag(testTableData, classTags = "") {
  let getClassTagsForTH = [];
  let testTableThRow = `<tr><th class="${classTags}">Testing Column</th></tr>`;
  getClassTagsForTH.push(testTableThRow);

  let testTableTdRows = [];
  for (let i = 0; i < testTableData.length; i++) {
    let testTableTdRow = `<tr><td>${testTableData[i]}</td></tr>`;
    testTableTdRows.push(testTableTdRow);
  }

  const tableWithMissingHeadTag = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort">
    <tbody>
    ${getClassTagsForTH}
    ${testTableTdRows}
    </tbody>
  </table> 
  </body>
  </html>`);

  // Call tablesort and make table sortable and simulate click from a user.
  tableSortJs((testing = true), tableWithMissingHeadTag.window.document);
  tableWithMissingHeadTag.window.document.querySelector("table th").click();
  // Make an array from table contents to test if sorted correctly.
  let table = tableWithMissingHeadTag.window.document.querySelector("table");
  const tableBody = table.querySelector("tbody");
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const testIfSortedList = tableRows.map(
    (tr) => tr.querySelectorAll("td").item(0).innerHTML
  );
  return testIfSortedList;
}

function createTestTableMissingBodyTag(testTableData, classTags = "") {
  let getClassTagsForTH = [];
  let testTableThRow = `<tr><th class="${classTags}">Testing Column</th></tr>`;
  getClassTagsForTH.push(testTableThRow);

  let testTableTdRows = [];
  for (let i = 0; i < testTableData.length; i++) {
    let testTableTdRow = `<tr><td>${testTableData[i]}</td></tr>`;
    testTableTdRows.push(testTableTdRow);
  }

  const tablewithMissingBodyTag = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort">
      <thead>
        ${getClassTagsForTH}
      </thead>
    ${testTableTdRows}
  </table> 
  </body>
  </html>`);

  // Call tablesort and make table sortable and simulate click from a user.
  tableSortJs((testing = true), tablewithMissingBodyTag.window.document);
  tablewithMissingBodyTag.window.document.querySelector("table th").click();
  // Make an array from table contents to test if sorted correctly.
  let table = tablewithMissingBodyTag.window.document.querySelector("table");
  const tableBody = table.querySelector("tbody");
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const testIfSortedList = tableRows.map(
    (tr) => tr.querySelectorAll("td").item(0).innerHTML
  );
  return testIfSortedList;
}

function createTestTableMissingBodyAndHeadTag(testTableData, classTags = "") {
  let getClassTagsForTH = [];
  let testTableThRow = `<tr><th class="${classTags}">Testing Column</th></tr>`;
  getClassTagsForTH.push(testTableThRow);

  let testTableTdRows = [];
  for (let i = 0; i < testTableData.length; i++) {
    let testTableTdRow = `<tr><td>${testTableData[i]}</td></tr>`;
    testTableTdRows.push(testTableTdRow);
  }

  const tableWithMissingBodyAndHeadTag = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort">
    ${getClassTagsForTH}
    ${testTableTdRows}
  </table> 
  </body>
  </html>`);

  // Call tablesort and make table sortable and simulate click from a user.
  tableSortJs((testing = true), tableWithMissingBodyAndHeadTag.window.document);
  tableWithMissingBodyAndHeadTag.window.document
    .querySelector("table th")
    .click();
  // Make an array from table contents to test if sorted correctly.
  let table =
    tableWithMissingBodyAndHeadTag.window.document.querySelector("table");
  const tableBody = table.querySelector("tbody");
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const testIfSortedList = tableRows.map(
    (tr) => tr.querySelectorAll("td").item(0).innerHTML
  );
  return testIfSortedList;
}

function createTestTableMultipleTBodies(
  testTableData,
  testTableData2,
  testTableData3,
  classTags = ""
) {
  let getClassTagsForTH = [];
  let testTableThRow = `<tr><th class="${classTags}">Testing Column</th></tr>`;
  getClassTagsForTH.push(testTableThRow);
  function makeTdRows(testTableData) {
    let testTableTdRows = [];
    for (let i = 0; i < testTableData.length; i++) {
      let testTableTdRow = `<tr><td>${testTableData[i]}</td></tr>`;
      testTableTdRows.push(testTableTdRow);
    }
    return testTableTdRows;
  }
  let testTableTdRows = makeTdRows(testTableData);
  let testTableTdRows2 = makeTdRows(testTableData2);
  let testTableTdRows3 = makeTdRows(testTableData3);
  const tableWithMultipleTableBodies = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort">
      <thead>
        ${getClassTagsForTH}
      </thead>
      <tbody>
        ${testTableTdRows}
      </tbody>
      <thead>
        ${getClassTagsForTH}
      </thead>
      <tbody>
        ${testTableTdRows2}
      </tbody>
      <thead>
        ${getClassTagsForTH}
      </thead>
      <tbody>
        ${testTableTdRows3}
      </tbody>
  </table> 
  </body>
  </html>`);
  // Call tablesort and make table sortable and simulate click from a user.
  tableSortJs((testing = true), tableWithMultipleTableBodies.window.document);
  const tableTH =
    tableWithMultipleTableBodies.window.document.querySelectorAll("table th");
  for (let th of tableTH) {
    th.click();
  }
  // Make an array from table contents to test if sorted correctly.
  let table =
    tableWithMultipleTableBodies.window.document.querySelector("table");
  const tableBodies = table.querySelectorAll("tbody");
  const tableHeads = table.querySelectorAll("thead");

  let tableRowArray = [];
  for (let i = 0; i < tableHeads.length; i++) {
    let tableRows = [...tableBodies.item(i).querySelectorAll("tr")];
    tableRowArray.push(tableRows);
  }
  let testIfSortedArray = [];
  for (let i = 0; i < tableHeads.length; i++) {
    let testIfSortedList = tableRowArray[i].map(
      (tr) => tr.querySelectorAll("td").item(0).innerHTML
    );
    testIfSortedArray.push(testIfSortedList);
  }
  return [...testIfSortedArray];
}

module.exports = {
  createTestTableNoMissingTags,
  createTestTableMissingHeadTag,
  createTestTableMissingBodyTag,
  createTestTableMissingBodyAndHeadTag,
  createTestTableMultipleTBodies,
};
