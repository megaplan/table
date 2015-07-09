# rc-table

react table component

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-table.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-table
[travis-image]: https://img.shields.io/travis/react-component/table.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/table
[coveralls-image]: https://img.shields.io/coveralls/react-component/table.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/table?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/table.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/table
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-table.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-table

## install

[![rc-table](https://nodei.co/npm/rc-table.png)](https://npmjs.org/package/rc-table)


## Development

```
npm install
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/table/examples/

## Usage

```js
var React = require('react');
var Table = require('rc-table');
require('rc-table/assets/index.css');

var columns = [
  {title: '表头1', dataIndex: 'a', key:'a',width: 100},
  {id: '123', title: '表头2', dataIndex: 'b', key:'b', width: 100},
  {title: '表头3', dataIndex: 'c',  key:'c',width: 200},
  {
    title: '操作', dataIndex: '',  key:'d',render: function () {
    return <a href="#">操作</a>
  }
  }
];

var data = [{a: '123',key:'1'}, {a: 'cdd', b: 'edd',key:'2'}, {a: '1333', c: 'eee', d: 2,key:'3'}];

var table = React.render(
  <div>
    <h2>simple table</h2>
    <Table columns={columns}
      data={data}
      className="table"/>
  </div>,
  document.getElementById('__react-content')
);
```
## API 

### property

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>prefixCls</td>
          <td>String</td>
          <th>rc-table</th>
          <td></td>
      </tr>
      <tr>
          <td>className</td>
          <td>String</td>
          <th></th>
          <td>additional className</td>
      </tr>
      <tr>
          <td>useFixedHeader</td>
          <td>Boolean</td>
          <th>false</th>
          <td>whether use separator table for header. better set width for columns</td>
      </tr>
      <tr>
          <td>rowKey</td>
          <td>Function(recode):string</td>
          <th>record.key</th>
          <td>default use record.key as rowKey</td>
      </tr>
      <tr>
          <td>data</td>
          <td>Array<Object></td>
          <th></th>
          <td>data record array to be rendered</td>
      </tr>
      <tr>
          <td>columns</td>
          <td>Array<Object></td>
          <th></th>
          <td>
            The columns config of table. contains

            * key : key of this column
            * title : The title of column
            * dataIndex : display the data field
            * width : The width of column. The width of the specific proportion calculation according to the width of the columns
            * renderer : The render function of cell , has two params. value : the text of this cell;obj : the record of this row
          </td>
      </tr>
    </tbody>
</table>

## Test Case

http://localhost:8000/tests/runner.html?coverage

## Coverage

http://localhost:8000/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8000/tests/runner.html?coverage

## License

rc-table is released under the MIT license.
