// TEST TABLE FOR CLASSES THAT ARE INFERRED FOR <TH>.
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("iconv-lite").encodingExists("foo");
const tableSortJs = require("../src/table-sort");

function createTestTable(
  testTableData,
  thAttributes = { classTags: "", colspan: "" },
  props = { colsToClick: [], invisibleIndex: [], tableTags: "", trClasses: "" }
) {
  const numberOfTableColumns = Object.keys(testTableData).length;
  let testTableHeaders = "";
  for (let i = 0; i < numberOfTableColumns; i++) {
    testTableHeaders += `<th colspan="${thAttributes.colspan}">Testing Column</th>`;
  }
  testTableHeaders = `<tr> ${testTableHeaders} </tr>`;

  function getRowsOfTd(index, type) {
    let rowsOfTd = "";
    for (let key in testTableData) {
      if (testTableData[key].td) {
        if (type === "data-sort") {
          rowsOfTd += `<td data-sort="${index}">${testTableData[key].td[index]}</td>`;
        } else {
          rowsOfTd += `<td>${testTableData[key].td[index]}</td>`;
        }
      }
    }
    return rowsOfTd;
  }

  let testTableTdRows = [];
  for (let i = 0; i < testTableData["col0"].td.length; i++) {
    let testTableTdRow;
    if (thAttributes.classTags.includes("data-sort")) {
      testTableTdRow = `${getRowsOfTd(i, "data-sort")}`;
    } else {
      testTableTdRow = `${getRowsOfTd(i)}`;
    }
    if (
      props.invisibleIndex !== undefined &&
      props.invisibleIndex.includes(i)
    ) {
      testTableTdRows.push(`<tr style="display: none;">${testTableTdRow}</tr>`);
    } else {
      if (props.tableTags === "cells-sort" || props.tableTags === "tr-sort") {
        testTableTdRows.push(
          `<tr class="${props.trClasses}-${i}"> ${testTableTdRow}</tr>`
        );
      } else {
        testTableTdRows.push(
          `<tr class="${props.trClasses}"> ${testTableTdRow}</tr>`
        );
      }
    }
  }

  const dom = new JSDOM(`<!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <table class="table-sort ${props.tableTags}">
        <thead>
          ${testTableHeaders}
        </thead>
        <tbody>
          ${testTableTdRows}
        </tbody>
    </table> 
  </body>
  </html>`);

  // Call tablesort and make table sortable and simulate clicks from a user.
  tableSortJs(true, dom.window.document);
  // Make an array from table contents to test if sorted correctly.
  let table = dom.window.document.querySelector("table");
  const tableHeadWithInferredClassName = table.querySelectorAll("thead th");
  let inferedClassNamesOfTh = Array.from(tableHeadWithInferredClassName).map(
    (e) => e.getAttribute("class")
  );
  return inferedClassNamesOfTh;
}

module.exports = createTestTable;
