(this["webpackJsonphtml-tablesorter"]=this["webpackJsonphtml-tablesorter"]||[]).push([[0],{19:function(e,n,t){e.exports=t(32)},24:function(e,n,t){},25:function(e,n,t){e.exports=t.p+"static/media/logo.5d5d9eef.svg"},26:function(e,n,t){},32:function(e,n,t){"use strict";t.r(n);var o=t(0),l=t.n(o),a=t(16),r=t.n(a),c=(t(24),t(10)),s=t(8),i=[],u={};document.addEventListener("DOMContentLoaded",(function(e){var n,t=Object(s.a)(document.getElementsByTagName("table"));try{for(t.s();!(n=t.n()).done;){var o=n.value;"table-sort"===o.className&&(o.getElementsByTagName("thead")?o.getElementsByTagName("tbody")?function(){var e,n=o.querySelector("thead"),t=o.querySelector("tbody"),l=n.querySelectorAll("th"),a=Object(s.a)(l.entries("table"));try{var r=function(){var n=Object(c.a)(e.value,2),o=n[0],l=n[1],a=0;l.addEventListener("click",(function(){a+=1,function(){var e,n=t.querySelectorAll("tr"),r=Object(s.a)(n.entries());try{for(r.s();!(e=r.n()).done;){var d=Object(c.a)(e.value,2),m=d[0],g=d[1];""!==g.querySelectorAll("td").item(o).innerHTML?(i.push(g.querySelectorAll("td").item(o).innerHTML+"#"+m),u[g.querySelectorAll("td").item(o).innerHTML+"#"+m]=g.innerHTML):(i.push("0#"+m),u["0#"+m]=g.innerHTML,console.log(u))}}catch(y){r.e(y)}finally{r.f()}function b(e,n){return console.log(i),e.localeCompare(n,navigator.languages[0]||navigator.language)}function f(e,n){return b(n,e)}console.log(i[0]),i[0].search(/[^A-Za-z0-9]/)&&("order-by-desc"===l.className&&1===a?i.sort(f,{numeric:!0,ignorePunctuation:!0}):"order-by-desc"===l.className&&2===a?(i.sort(b,{numeric:!0,ignorePunctuation:!0}),a=0):1===a?i.sort(b,{numeric:!0,ignorePunctuation:!0}):2===a&&(i.sort(f,{numeric:!0,ignorePunctuation:!0}),a=0))}(),function(){var e,n=t.querySelectorAll("tr"),o=Object(s.a)(n.entries());try{for(o.s();!(e=o.n()).done;){var l=Object(c.a)(e.value,2),a=l[0];l[1].innerHTML=u[i[a]]}}catch(r){o.e(r)}finally{o.f()}i.length=0}()}))};for(a.s();!(e=a.n()).done;)r()}catch(d){a.e(d)}finally{a.f()}}():console.log("<tbody> Tag does not exist in table"):console.log("<thead> Tag does not exist in table"))}}catch(l){t.e(l)}finally{t.f()}}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));t(25),t(26);var d=function(){return l.a.createElement("body",null,l.a.createElement("pre",null,"     \nconsole.log('hello world')\nconst columnData = [];\nconst dictOfColumnIndexAndTableRow = {\n}\n\ndocument.addEventListener(\"DOMContentLoaded\", function (e) {\n    console.log('dom loaded')\nfor (let sortableTable of document.getElementsByTagName('table')) {\n    if (sortableTable.className === 'table-sort') {\n        console.log('table-sort')\n    if (!sortableTable.getElementsByTagName('thead')) {\n        console.log('<thead> Tag does not exist in table');\n    }\n    else if (!sortableTable.getElementsByTagName('tbody')) {\n        console.log('<tbody> Tag does not exist in table');\n    }\n    else {\n        const tableHead = sortableTable.querySelector('thead')\n        const tableBody = sortableTable.querySelector('tbody')\n        const tableHeadHeaders = tableHead.querySelectorAll('th')\n        \n        for (let [columnIndex, th] of tableHeadHeaders.entries('table')) {\n            console.log('th')\n        let timesClickedColumn = 0\n        th.addEventListener(\"click\", function () {\n            timesClickedColumn += 1\n            console.log('clicked')\n            function getTableDataOnClick() {\n            const tableRows = tableBody.querySelectorAll('tr');\n            for (let [i, tr] of tableRows.entries()) {\n                if (tr.querySelectorAll('td').item(columnIndex).innerHTML !== ''){\n                columnData.push(tr.querySelectorAll('td').item(columnIndex).innerHTML+'#'+i)\n                dictOfColumnIndexAndTableRow[tr.querySelectorAll('td').item(columnIndex).innerHTML+'#'+i] = tr.innerHTML\n                } else{\n                // Fill in blank table cells with a value(0), so they can be sorted.\n                columnData.push('0#'+i)\n                dictOfColumnIndexAndTableRow['0#'+i] = tr.innerHTML\n                console.log(dictOfColumnIndexAndTableRow)\n                }\n            }\n\n            function naturalSortAescending(a,b){\n                console.log('sort1')\n                return a.localeCompare(b, navigator.languages[0] || navigator.language,\n                    {numeric: true, ignorePunctuation: true})\n            }\n            function naturalSortDescending(a,b){\n                console.log('sort2')\n                return naturalSortAescending(b,a)\n            }\n            // Sort naturally; default aescending unless th is using 'order-by-desc' as className.\n            console.log(columnData[0])\n            //[^A-Za-z0-9s]\n\n            if (columnData[0].search(/[^A-Za-z0-9s]/)) {\n                console.log('test1')\n                if (th.className === 'order-by-desc' && timesClickedColumn === 1){\n                columnData.sort(naturalSortDescending,{numeric: true, ignorePunctuation: true})\n                }else if(th.className === 'order-by-desc' && timesClickedColumn === 2){\n                columnData.sort(naturalSortAescending,{numeric: true, ignorePunctuation: true})\n                    timesClickedColumn = 0\n                }\n            else if (timesClickedColumn === 1){   \n                console.log('1')  \n                columnData.sort(naturalSortAescending)         \n            } else if (timesClickedColumn === 2){\n                \n                columnData.sort(naturalSortDescending)\n                timesClickedColumn = 0\n                } \n            }\n            }\n            getTableDataOnClick();\n            function sortingFunction() {\n            const tableRows = tableBody.querySelectorAll('tr');\n            for (let [i, tr] of tableRows.entries()) {\n           \n                tr.innerHTML = dictOfColumnIndexAndTableRow[columnData[i]]\n            }\n            columnData.length = 0\n            }\n            sortingFunction()\n        });\n        }\n    }\n    }\n}\n})\n"))},m=t(17),g=t(1);r.a.render(l.a.createElement(m.a,null,l.a.createElement(g.a,{exact:!0,path:"/.js",component:d},l.a.createElement(d,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[19,1,2]]]);
//# sourceMappingURL=main.ae7aad9b.chunk.js.map