/*
table-sort-js
Author: Kyle Wannacott
Licence: MIT License Copyright (c) 2021-2024 Kyle Wannacott

GitHub Repository: https://github.com/kyle-wannacott/table-sort-js

Instructions:
	Load as script:
	<script src="https://cdn.jsdelivr.net/npm/table-sort-js/table-sort.min.js"></script>
  Add class="table-sort" to tables you'd like to make sortable
  Click on the table headers to sort them.
*/

function tableSortJs(testingTableSortJS = false, domDocumentWindow = document) {
  function getHTMLTables() {
    const getTagTable = !testingTableSortJS
      ? document.getElementsByTagName("table")
      : domDocumentWindow.getElementsByTagName("table");
    return [getTagTable];
  }

  const [getTagTable] = getHTMLTables();
  const columnIndexAndTableRow = {};
  for (let table of getTagTable) {
    if (
      table.classList.contains("table-sort") &&
      !table.classList.contains("table-processed")
    ) {
      makeTableSortable(table);
    }
  }

  function createMissingTableHead(sortableTable) {
    let createTableHead = !testingTableSortJS
      ? document.createElement("thead")
      : domDocumentWindow.createElement("thead");
    createTableHead.appendChild(sortableTable.rows[0]);
    sortableTable.insertBefore(createTableHead, sortableTable.firstChild);
  }

  function getTableBodies(sortableTable) {
    if (sortableTable.getElementsByTagName("thead").length === 0) {
      createMissingTableHead(sortableTable);
      if (sortableTable.querySelectorAll("tbody").length > 1) {
        // don't select empty tbody that the browser creates
        return sortableTable.querySelectorAll("tbody:not(:nth-child(2))");
      } else {
        return sortableTable.querySelectorAll("tbody");
      }
    } else {
      // if <tr> or <td> exists below <thead> the browser will make <tbody>
      return sortableTable.querySelectorAll("tbody");
    }
  }

  function inferSortClasses(tableRows, columnIndex, column, th) {
    try {
      const runtimeRegex = /^(\d+h)?\s?(\d+m)?\s?(\d+s)?$/i;
      const fileSizeRegex = /^([.0-9]+)\s?(B|KB|KiB|MB|MiB|GB|GiB|TB|TiB)/i;
      // Don't infer dates with delimiter "."; as could capture semantic version numbers.
      const dmyRegex = /^(\d\d?)[/-](\d\d?)[/-]((\d\d)?\d\d)/;
      const ymdRegex = /^(\d\d\d\d)[/-](\d\d?)[/-](\d\d?)/;
      const numericRegex =
        /^-?(?:[$£€¥₩₽₺₣฿₿Ξξ¤¿\u20A1\uFFE0]\d{1,3}(?:[',]\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?(?:[',]\d{3})*?)(?:%?)$/;

      const inferableClasses = {
        runtime: { regexp: runtimeRegex, class: "runtime-sort", count: 0 },
        filesize: { regexp: fileSizeRegex, class: "file-size-sort", count: 0 },
        dmyDates: { regexp: dmyRegex, class: "dates-dmy-sort", count: 0 },
        ymdDates: { regexp: ymdRegex, class: "dates-ymd-sort", count: 0 },
        numericRegex: { regexp: numericRegex, class: "numeric-sort", count: 0 },
      };
      let classNameAdded = false;
      let regexNotFoundCount = 0;
      const threshold = Math.ceil(tableRows.length / 2);
      for (let tr of tableRows) {
        if (regexNotFoundCount >= threshold) {
          break;
        }
        const tableColumn = tr
          .querySelectorAll("* > th , * > td")
          .item(
            column.span[columnIndex] === 1
              ? column.spanSum[columnIndex] - 1
              : column.spanSum[columnIndex] - column.span[columnIndex]
          );
        let foundMatch = false;
        for (let key of Object.keys(inferableClasses)) {
          let classRegexp = inferableClasses[key].regexp;
          let columnOfTd = testingTableSortJS
            ? tableColumn.textContent
            : tableColumn.innerText;
          if (columnOfTd !== undefined && columnOfTd.match(classRegexp)) {
            foundMatch = true;
            inferableClasses[key].count++;
          }
          if (inferableClasses[key].count >= threshold) {
            th.classList.add(inferableClasses[key].class);
            classNameAdded = true;
            break;
          }
        }
        if (classNameAdded) {
          break;
        }
        if (!foundMatch) {
          regexNotFoundCount++;
          continue;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  function makeTableSortable(sortableTable) {
    sortableTable.classList.add("table-processed");
    const table = {
      bodies: getTableBodies(sortableTable),
      theads: sortableTable.querySelectorAll("thead"),
      rows: [],
      headers: [],
    };
    if (table.bodies.item(0) == null) {
      return;
    }
    for (let index of table.theads.keys()) {
      table.headers.push(
        table.theads.item(index).querySelectorAll("* > th , * > td")
      );
    }
    for (let index of table.bodies.keys()) {
      table.rows.push(table.bodies.item(index).querySelectorAll("tr"));
    }
    table.hasClass = {
      noClassInfer: sortableTable.classList.contains("no-class-infer"),
      cellsSort: sortableTable.classList.contains("cells-sort"),
      rememberSort: sortableTable.classList.contains("remember-sort"),
      tableArrows: Array.from(sortableTable.classList).filter((item) =>
        item.includes("table-arrows")
      ),
    };

    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    div.style.display = "flex";
    label.innerHTML = "Search:";
    input.setAttribute("type", "text");
    input.setAttribute("id", "fuzzy-search");
    input.tableRows = table.rows;
    input.table = table;
    input.addEventListener("input", sortFuzzySearch);
    div.appendChild(label);
    div.appendChild(input);
    sortableTable.insertBefore(div, sortableTable.firstChild);

    for (
      let headerIndex = 0;
      headerIndex < table.theads.length;
      headerIndex++
    ) {
      let columnIndexesClicked = [];
      const column = { span: {}, spanSum: {} };
      getColSpanData(table.headers[headerIndex], column);
      for (let [columnIndex, th] of table.headers[headerIndex].entries()) {
        if (!th.classList.contains("disable-sort")) {
          th.style.cursor = "pointer";
          if (!table.hasClass.noClassInfer) {
            inferSortClasses(table.rows[headerIndex], columnIndex, column, th);
          }
          makeEachColumnSortable(
            th,
            headerIndex,
            columnIndex,
            table,
            columnIndexesClicked
          );
        }
      }
    }
  }

  function cellsOrRows(table, tr) {
    if (table.hasClass.cellsSort) {
      return tr.innerHTML;
    } else {
      return tr.outerHTML;
    }
  }

  function sortDataAttributes(table, column) {
    for (let [i, tr] of table.visibleRows.entries()) {
      let dataAttributeTd = column.getColumn(tr, column.spanSum, column.span)
        .dataset.sort;
      column.toBeSorted.push(`${dataAttributeTd}#${i}`);
      columnIndexAndTableRow[column.toBeSorted[i]] = cellsOrRows(table, tr);
    }
  }

  function sortFuzzySearch(e) {
    for (
      let bodyIndex = 0;
      bodyIndex < e.target.tableRows.length;
      bodyIndex++
    ) {
      const columnToBeSorted = [];
      for (let [i, tr] of e.target.tableRows[bodyIndex].entries()) {
        const charMatchesInRow = [];
        const tds = tr.querySelectorAll("td");
        const tdLengths = [];
        for (let td of tds) {
          let amountOfCharsInTd = 0;
          for (let character of Array.from(e.target.value)) {
            if (td.innerText.includes(character)) {
              amountOfCharsInTd += 1;
            }
          }
          charMatchesInRow.push(amountOfCharsInTd);
          tdLengths.push(td.innerText.length);
        }
        let tdWithMaxCharMatch = Math.max(...charMatchesInRow);
        let index = charMatchesInRow.indexOf(tdWithMaxCharMatch);

        if (!isNaN(tdWithMaxCharMatch / tdLengths[index])) {
          columnToBeSorted.push(
            `${tdWithMaxCharMatch / tdLengths[index]}#${i}`
          );
          columnIndexAndTableRow[
            `${tdWithMaxCharMatch / tdLengths[index]}#${i}`
          ] = cellsOrRows(e.target.table, tr);
        } else {
          columnToBeSorted.push(`0#${i}`);
          columnIndexAndTableRow[`0#${i}`] = cellsOrRows(e.target.table, tr);
        }
      }
      columnToBeSorted.sort().reverse();
      for (let [i, tr] of e.target.tableRows[bodyIndex].entries()) {
        if (e.target.table.hasClass.cellsSort) {
          tr.innerHTML = columnIndexAndTableRow[columnToBeSorted[i]];
        } else {
          tr.outerHTML = columnIndexAndTableRow[columnToBeSorted[i]];
        }
      }
    }
  }

  function sortFileSize(table, column, columnIndex) {
    let unitToMultiplier = {
      b: 1,
      kb: 1000,
      kib: 2 ** 10,
      mb: 1e6,
      mib: 2 ** 20,
      gb: 1e9,
      gib: 2 ** 30,
      tb: 1e12,
      tib: 2 ** 40,
    };
    const numberWithUnitType = /([.0-9]+)\s?(B|KB|KiB|MB|MiB|GB|GiB|TB|TiB)/i;
    for (let [i, tr] of table.visibleRows.entries()) {
      let fileSizeTd = tr
        .querySelectorAll("* > th , * > td")
        .item(columnIndex).textContent;
      let match = fileSizeTd.match(numberWithUnitType);
      if (match) {
        let number = parseFloat(match[1]);
        let unit = match[2].toLowerCase();
        let multiplier = unitToMultiplier[unit];
        column.toBeSorted.push(`${number * multiplier}#${i}`);
        columnIndexAndTableRow[column.toBeSorted[i]] = cellsOrRows(table, tr);
      }
    }
  }

  function sortDates(datesFormat, table, column) {
      for (let [i, tr] of table.visibleRows.entries()) {
        let columnOfTd, datesRegex;
        if (datesFormat === "mdy" || datesFormat === "dmy") {
          datesRegex = /^(\d\d?)[./-](\d\d?)[./-]((\d\d)?\d\d)/;
        } else if (datesFormat === "ymd") {
          datesRegex = /^(\d\d\d\d)[./-](\d\d?)[./-](\d\d?)/;
        }
        columnOfTd = column.getColumn(
          tr,
          column.spanSum,
          column.span
        ).textContent;
        let match = columnOfTd.match(datesRegex);
        let [years, days, months] = [0, 0, 0];
        let numberToSort = columnOfTd;
        if (match) {
          const [regPos1, regPos2, regPos3] = [match[1], match[2], match[3]];
          if (regPos1 && regPos2 && regPos3) {
            if (datesFormat === "mdy") {
              [months, days, years] = [regPos1, regPos2, regPos3];
            } else if (datesFormat === "ymd") {
              [years, months, days] = [regPos1, regPos2, regPos3];
            } else {
              [days, months, years] = [regPos1, regPos2, regPos3];
            }
          }
          numberToSort = Number(
            years +
              String(months).padStart(2, "0") +
              String(days).padStart(2, "0")
          );
        }
        column.toBeSorted.push(`${numberToSort}#${i}`);
        columnIndexAndTableRow[column.toBeSorted[i]] = cellsOrRows(table, tr);
      }
  }

  function sortByRuntime(table, column) {
      for (let [i, tr] of table.visibleRows.entries()) {
        const regexMinutesAndSeconds = /^(\d+h)?\s?(\d+m)?\s?(\d+s)?$/i;
        let columnOfTd = "";
        // TODO: github actions runtime didn't like textContent, tests didn't like innerText?
        columnOfTd = column.getColumn(tr, column.spanSum, column.span);
        columnOfTd = testingTableSortJS
          ? columnOfTd.textContent
          : columnOfTd.innerText;
        let match = columnOfTd.match(regexMinutesAndSeconds);
        let [minutesInSeconds, hours, seconds] = [0, 0, 0];
        let timeinSeconds = columnOfTd;
        if (match) {
          const regexHours = match[1];
          if (regexHours) {
            hours = Number(regexHours.replace("h", "")) * 60 * 60;
          }
          const regexMinutes = match[2];
          if (regexMinutes) {
            minutesInSeconds = Number(regexMinutes.replace("m", "")) * 60;
          }
          const regexSeconds = match[3];
          if (regexSeconds) {
            seconds = Number(regexSeconds.replace("s", ""));
          }
          timeinSeconds = hours + minutesInSeconds + seconds;
        }
        column.toBeSorted.push(`${timeinSeconds}#${i}`);
        columnIndexAndTableRow[column.toBeSorted[i]] = cellsOrRows(table, tr);
      }
  }

  function getTableData(tableProperties, timesClickedColumn) {
    const {
      table,
      tableRows,
      fillValue,
      column,
      th,
      hasThClass,
      isSortDates,
      desc,
      arrow,
    } = tableProperties;
    for (let [i, tr] of tableRows.entries()) {
      let tdTextContent = column.getColumn(
        tr,
        column.spanSum,
        column.span
      ).textContent;
      if (tdTextContent.length === 0) {
        tdTextContent = "";
      }
      if (tdTextContent.trim() !== "") {
        if (
          !hasThClass.fileSize &&
          !hasThClass.dataSort &&
          !hasThClass.runtime &&
          !hasThClass.filesize &&
          !isSortDates.dayMonthYear &&
          !isSortDates.yearMonthDay &&
          !isSortDates.monthDayYear
        ) {
          column.toBeSorted.push(`${tdTextContent}#${i}`);
          columnIndexAndTableRow[`${tdTextContent}#${i}`] = cellsOrRows(
            table,
            tr
          );
        }
      } else {
        // Fill in blank table cells dict key with filler value.
        column.toBeSorted.push(`${fillValue}#${i}`);
        columnIndexAndTableRow[`${fillValue}#${i}`] = cellsOrRows(table, tr);
      }
    }

    const isPunctSort = th.classList.contains("punct-sort");
    const isAlphaSort = th.classList.contains("alpha-sort");
    const isNumericSort = th.classList.contains("numeric-sort");

    function parseNumberFromString(str) {
      let num;
      str = str.slice(0, str.indexOf("#"));
      if (str.match(/^\(-?(\d+(?:\.\d+)?)\)$/)) {
        num = -1 * Number(str.slice(1, -1));
      } else {
        num = Number(str);
      }
      return num;
    }

    function strLocaleCompare(str1, str2) {
      return str1.localeCompare(
        str2,
        navigator.languages[0] || navigator.language,
        { numeric: !isAlphaSort, ignorePunctuation: !isPunctSort }
      );
    }

    function handleNumbers(str1, str2) {
      const matchCurrencyCommaAndPercent = /[$£€¥₩₽₺₣฿₿Ξξ¤¿\u20A1\uFFE0,% ]/g;
      str1 = str1.replace(matchCurrencyCommaAndPercent, "");
      str2 = str2.replace(matchCurrencyCommaAndPercent, "");
      const [num1, num2] = [
        parseNumberFromString(str1),
        parseNumberFromString(str2),
      ];

      if (!isNaN(num1) && !isNaN(num2)) {
        return num1 - num2;
      } else {
        return strLocaleCompare(str1, str2);
      }
    }

    function sortAscending(a, b) {
      if (a.includes(`${fillValue}#`)) {
        return 1;
      } else if (b.includes(`${fillValue}#`)) {
        return -1;
      } else if (isNumericSort) {
        return handleNumbers(a, b);
      } else {
        return strLocaleCompare(a, b);
      }
    }

    function sortDescending(a, b) {
      return sortAscending(b, a);
    }

    function clearArrows(arrow) {
      th.innerHTML = th.innerHTML.replace(arrow.neutral, "");
      th.innerHTML = th.innerHTML.replace(arrow.up, "");
      th.innerHTML = th.innerHTML.replace(arrow.down, "");
    }

    if (column.toBeSorted[0] === undefined) {
      return;
    }

    function changeArrowAndSort(arrowDirection, sortDirection) {
      if (table.hasClass.tableArrows[0]) {
        clearArrows(arrow);
        th.insertAdjacentText("beforeend", arrowDirection);
      }
      column.toBeSorted.sort(sortDirection, {
        numeric: !isAlphaSort,
        ignorePunctuation: !isPunctSort,
      });
    }

    if (timesClickedColumn === 1) {
      desc
        ? changeArrowAndSort(arrow.down, sortDescending)
        : changeArrowAndSort(arrow.up, sortAscending);
    } else if (timesClickedColumn === 2) {
      timesClickedColumn = 0;
      desc
        ? changeArrowAndSort(arrow.up, sortAscending)
        : changeArrowAndSort(arrow.down, sortDescending);
    }
    return timesClickedColumn;
  }

  function updateFilesize(i, table, tr, column, columnIndex) {
    if (table.hasClass.cellsSort) {
      tr.innerHTML = columnIndexAndTableRow[column.toBeSorted[i]];
    } else {
      // We do this to sort rows rather than cells:
      const template = document.createElement("template");
      template.innerHTML = columnIndexAndTableRow[column.toBeSorted[i]];
      tr = template.content.firstChild;
    }
    let getColumnTd = column.getColumn(tr, column.spanSum, column.span);
    let fileSizeInBytesHTML = getColumnTd.outerHTML;
    const fileSizeInBytesText = getColumnTd.textContent;
    const fileSize = column.toBeSorted[i].replace(/#[0-9]*/, "");
    let prefixes = ["", "Ki", "Mi", "Gi", "Ti", "Pi"];
    let replaced = false;
    for (let i = 0; i < prefixes.length; ++i) {
      let nextPrefixMultiplier = 2 ** (10 * (i + 1));
      if (fileSize < nextPrefixMultiplier) {
        let prefixMultiplier = 2 ** (10 * i);
        fileSizeInBytesHTML = fileSizeInBytesHTML.replace(
          fileSizeInBytesText,
          `${(fileSize / prefixMultiplier).toFixed(2)} ${prefixes[i]}B`
        );
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      fileSizeInBytesHTML = fileSizeInBytesHTML.replace(
        fileSizeInBytesText,
        "NaN"
      );
    }
    tr.querySelectorAll("* > th , * > td").item(columnIndex).innerHTML =
      fileSizeInBytesHTML;
    return table.hasClass.cellsSort ? tr.innerHTML : tr.outerHTML;
  }

  function updateTable(tableProperties) {
    const { column, table, columnIndex, hasThClass } = tableProperties;
    for (let [i, tr] of table.visibleRows.entries()) {
      if (hasThClass.fileSize) {
        if (table.hasClass.cellsSort) {
          tr.innerHTML = updateFilesize(i, table, tr, column, columnIndex);
        } else {
          tr.outerHTML = updateFilesize(i, table, tr, column, columnIndex);
        }
      } else if (!hasThClass.fileSize) {
        if (table.hasClass.cellsSort) {
          tr.innerHTML = columnIndexAndTableRow[column.toBeSorted[i]];
        } else {
          tr.outerHTML = columnIndexAndTableRow[column.toBeSorted[i]];
        }
      }
    }
  }

  function getColSpanData(headers, column) {
    headers.forEach((th, index) => {
      column.span[index] = th.colSpan;
      if (index === 0) column.spanSum[index] = th.colSpan;
      else column.spanSum[index] = column.spanSum[index - 1] + th.colSpan;
    });
  }

  function rememberSort(columnIndexesClicked, timesClickedColumn, columnIndex) {
    // if user clicked different column from first column reset times clicked.
    columnIndexesClicked.push(columnIndex);
    if (timesClickedColumn === 1 && columnIndexesClicked.length > 1) {
      const lastColumnClicked =
        columnIndexesClicked[columnIndexesClicked.length - 1];
      const secondLastColumnClicked =
        columnIndexesClicked[columnIndexesClicked.length - 2];
      if (lastColumnClicked !== secondLastColumnClicked) {
        columnIndexesClicked.shift();
        timesClickedColumn = 0;
      }
    }
    return timesClickedColumn;
  }

  function makeEachColumnSortable(
    th,
    headerIndex,
    columnIndex,
    table,
    columnIndexesClicked
  ) {
    const desc = th.classList.contains("order-by-desc");
    let fillValue = "!X!Y!Z!";
    let arrow = { up: " ↑", neutral: " ↕", down: " ↓" };
    if (table.hasClass.tableArrows[0]) {
      if (table.hasClass.tableArrows[0].split("-").length > 2) {
        // Array.from to support utf-8 strings e.g emojis
        let customArrow = Array.from(
          table.hasClass.tableArrows[0].split("-")[2]
        );
        customArrow = customArrow.map((i) => " " + i);
        console.log(customArrow);
        if (customArrow.length === 3) {
          [arrow.up, arrow.neutral, arrow.down] = [...customArrow];
        }
      }
      th.insertAdjacentText("beforeend", arrow.neutral);
    }

    let timesClickedColumn = 0;
    const column = {
      getColumn: function getColumn(tr, colSpanSum, colSpanData) {
        return tr
          .querySelectorAll("* > th , * > td")
          .item(
            colSpanData[columnIndex] === 1
              ? colSpanSum[columnIndex] - 1
              : colSpanSum[columnIndex] - colSpanData[columnIndex]
          );
      },
    };
    th.addEventListener("click", function () {
      column.toBeSorted = [];
      column.span = {};
      column.spanSum = {};
      getColSpanData(table.headers[headerIndex], column);

      table.visibleRows = Array.prototype.filter.call(
        table.bodies.item(headerIndex).querySelectorAll("tr"),
        (tr) => {
          return tr.style.display !== "none";
        }
      );

      if (!table.hasClass.rememberSort) {
        timesClickedColumn = rememberSort(
          columnIndexesClicked,
          timesClickedColumn,
          columnIndex
        );
      }
      timesClickedColumn += 1;

      const hasThClass = {
        dataSort: th.classList.contains("data-sort"),
        fileSize: th.classList.contains("file-size-sort"),
        runtime: th.classList.contains("runtime-sort"),
      };

      if (hasThClass.dataSort) {
        sortDataAttributes(table, column);
      }
      if (hasThClass.fileSize) {
        sortFileSize(table, column, columnIndex, fillValue);
      }
      if (hasThClass.runtime) {
        sortByRuntime(table, column);
      }

      const isSortDates = {
        dayMonthYear: th.classList.contains("dates-dmy-sort"),
        monthDayYear: th.classList.contains("dates-mdy-sort"),
        yearMonthDay: th.classList.contains("dates-ymd-sort"),
      };
      // pick mdy first to override the inferred default class which is dmy.
      if (isSortDates.monthDayYear) {
        sortDates("mdy", table, column);
      } else if (isSortDates.yearMonthDay) {
        sortDates("ymd", table, column);
      } else if (isSortDates.dayMonthYear) {
        sortDates("dmy", table, column);
      }

      const tableProperties = {
        table,
        tableRows: table.visibleRows,
        fillValue,
        column,
        columnIndex,
        th,
        hasThClass,
        isSortDates,
        desc,
        timesClickedColumn,
        arrow,
      };
      timesClickedColumn = getTableData(tableProperties, timesClickedColumn);
      updateTable(tableProperties);
    });

    if (th.classList.contains("onload-sort")) {
      th.click();
    }
  }
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  tableSortJs();
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", tableSortJs, false);
}
if (typeof module == "object") {
  module.exports = tableSortJs;
}
