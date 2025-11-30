![npm version](https://img.shields.io/npm/v/table-sort-js)
![npm downloads](https://img.shields.io/npm/dm/table-sort-js)
[![jsDeliver downloads](https://data.jsdelivr.com/v1/package/npm/table-sort-js/badge)](https://www.jsdelivr.com/package/npm/table-sort-js)
![repo size](https://img.shields.io/github/repo-size/kyle-wannacott/table-sort-js)
![MIT licence](https://img.shields.io/github/license/kyle-wannacott/table-sort-js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![build status](https://img.shields.io/github/actions/workflow/status/kyle-wannacott/table-sort-js/jest.yml?branch=master)

# ![table-sort-icon](icons/table-sort-icon-48.png) TABLE-SORT-JS.

- Description: HTML table sorting library with sort type inference builtin and browser extension available. [#VanillaJS](http://vanilla-js.com/)

- [Demo](https://kyle-wannacott.github.io/Portfolio/#/GitHub)
- [Documentation.](https://kyle-wannacott.github.io/table-sort-js/docs/about.html)
  (work in progress)
- [npm package.](https://www.npmjs.com/package/table-sort-js) and [jsDelivr](https://www.jsdelivr.com/package/npm/table-sort-js)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/table-sort-js/) and [Chrome](https://chrome.google.com/webstore/detail/table-sort-js/dioemkojkjhlhmfiocgniipejgkbfibb) browser extensions: Tables of any website you visit become sortable!

## Install instructions.

- <b>Option 1</b>: Load as script from a Content Delivery Network (CDN):

```javascript
<script src="https://cdn.jsdelivr.net/npm/table-sort-js/table-sort.min.js"></script>
```

Or non-minified version (larger size, but easier to debug!):

```javascript
<script src="https://cdn.jsdelivr.net/npm/table-sort-js/table-sort.js"></script>
```

Example on how to use table-sort-js with [HTML](https://kyle-wannacott.github.io/table-sort-js/docs/html5.html)

- <b>Option 2:</b> Install from npm:

```javascript
npm install table-sort-js
```

```javascript
import tableSort from "table-sort-js/table-sort.js";
```

Examples on using table-sort-js with frontend frameworks such as [React.js](https://kyle-wannacott.github.io/table-sort-js/docs/react.html) and [Vue.js](https://kyle-wannacott.github.io/table-sort-js/docs/vue.html)

## To make tables sortable:

- Add `class="table-sort"` to HTML &lt;table&gt; tags.
- Click on table headers to sort columns.

#### Classes:

| &lt;table&gt; classes | Description                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| "table-sort"          | Make the table sortable! (Words, numbers, dates, file sizes)...                                              |
| "table-arrows"        | Display ascending or descending arrows. Supports custom arrows; for example: "table-arrows-⇈⇋⇊"              |
| "no-class-infer"      | Turns off inference for adding sort classes automatically e.g (file-size-sort, dates-dmy-sort), etc.         |
| "remember-sort"       | If clicking on different columns remembers sort of the original column.                                      |
| "cells-sort"          | sort cells (td) rather than table rows (tr); useful for keeping table rows with classes/attributes in place. |

<br>

| &lt;th&gt; classes | Description                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "data-sort"        | Sort by [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes), e.g &lt;td data-sort="42"&gt;. Useful for doing custom sorts. |
| "dates-mdy-sort"   | Sorts dates in US style mm/dd/yyyy format;. e.g (12/28/2023). Can use "/" or "-" as separator. Overides inferred "dates-dmy-sort" class.                                |
| "onload-sort"      | Sort column on loading of the page. Simulates a click from the user. (can only sort onload for one column)                                                              |
| "disable-sort"     | Disallow sorting the table by this specific column.                                                                                                                     |

<br>

| &lt;th&gt; Inferred Classes. | Description                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| "numeric-sort"               | Sorts numbers including decimals - Positive, Negative (in both minus and parenthesis representations).                              |
|                              | Supports common currencies e.g ($£€¥) and percentage signs e.g (0.39%)                                                              |
| "dates-dmy-sort"             | Sorts dates in dd/mm/yyyy format. e.g (18/10/1995). Can use "/" or "-" as separator.                                                |
| "dates-ymd-sort"             | Sorts dates in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) yyyy/mm/dd format. e.g (2021/10/28). Use "/" or "-" as separator. |
| "file-size-sort"             | Sorts file sizes(B->TiB) uses the binary prefix. (e.g 10 B, 100 KiB, 1 MiB); optional space between number and prefix.              |
| "runtime-sort"               | Sorts runtime in hours minutes and seconds e.g (10h 1m 20s). Useful for sorting the GitHub actions Run time column...               |

<br>

| &lt;th&gt; Classes that change defaults. | Description                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| "order-by-desc"                          | Order by descending on first click. (default is aescending)                                                         |
| "alpha-sort"                             | Sort alphabetically (z11,z2); default is [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order) (z2,z11). |
| "punct-sort"                             | Sort punctuation; default ignores punctuation.                                                                      |

## Development:

If you wish to contribute, install instructions can be found [here.](https://kyle-wannacott.github.io/table-sort-js/docs/development.html)
