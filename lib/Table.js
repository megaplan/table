'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var Table = _react2['default'].createClass({
  displayName: 'Table',

  propTypes: {
    data: _react2['default'].PropTypes.array,
    expandIconAsCell: _react2['default'].PropTypes.bool,
    expandIconColumnHeader: _react2['default'].PropTypes.bool,
    expandOnRowClick: _react2['default'].PropTypes.bool,
    defaultExpandAllRows: _react2['default'].PropTypes.bool,
    expandedRowKeys: _react2['default'].PropTypes.array,
    defaultExpandedRowKeys: _react2['default'].PropTypes.array,
    useFixedHeader: _react2['default'].PropTypes.bool,
    columns: _react2['default'].PropTypes.array,
    prefixCls: _react2['default'].PropTypes.string,
    bodyStyle: _react2['default'].PropTypes.object,
    style: _react2['default'].PropTypes.object,
    rowKey: _react2['default'].PropTypes.func,
    rowClassName: _react2['default'].PropTypes.func,
    expandedRowClassName: _react2['default'].PropTypes.func,
    childrenColumnName: _react2['default'].PropTypes.string,
    onExpandedRowsChange: _react2['default'].PropTypes.func,
    indentSize: _react2['default'].PropTypes.number,
    onRowClick: _react2['default'].PropTypes.func,
    columnsPageRange: _react2['default'].PropTypes.array,
    columnsPageSize: _react2['default'].PropTypes.number,
    expandIconColumnIndex: _react2['default'].PropTypes.number,
    showHeader: _react2['default'].PropTypes.bool,
    footer: _react2['default'].PropTypes.func,
    scroll: _react2['default'].PropTypes.object,
    onClickHeader: _react2['default'].PropTypes.func,
    sortColumn: _react2['default'].PropTypes.string,
    orderBy: _react2['default'].PropTypes.number,
    rowRef: _react2['default'].PropTypes.func,
    sortable: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      expandIconColumnHeader: true,
      expandOnRowClick: false,
      columns: [],
      defaultExpandAllRows: false,
      defaultExpandedRowKeys: [],
      rowKey: function rowKey(o) {
        return o.key;
      },
      rowClassName: function rowClassName() {
        return '';
      },
      expandedRowClassName: function expandedRowClassName() {
        return '';
      },
      onExpandedRowsChange: function onExpandedRowsChange() {},
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true,
      scroll: {},
      rowRef: function rowRef() {
        return null;
      }
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    var expandedRowKeys = [];
    var rows = [].concat(_toConsumableArray(props.data));
    if (props.defaultExpandAllRows) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row[props.childrenColumnName] && row[props.childrenColumnName].length > 0) {
          expandedRowKeys.push(props.rowKey(row));
          rows = rows.concat(row[props.childrenColumnName]);
        }
      }
    } else {
      expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
    }
    return {
      expandedRowKeys: expandedRowKeys,
      data: props.data,
      currentColumnsPage: 0,
      currentHoverIndex: null,
      scrollPosition: 'left'
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if (this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data
      });
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys
      });
    }
  },

  onExpandedRowsChange: function onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({
        expandedRowKeys: expandedRowKeys
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded: function onExpanded(expanded, record, event) {
    var info = this.findExpandedRow(record);
    if (info && !expanded) {
      this.onRowDestroy(record);
    } else if (!info && expanded) {
      var expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.props.rowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
    event.stopPropagation();
  },

  onRowDestroy: function onRowDestroy(record) {
    var expandedRows = this.getExpandedRows().concat();
    var rowKey = this.props.rowKey(record);
    var index = -1;
    expandedRows.forEach(function (r, i) {
      if (r === rowKey) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  onHeadCellClick: function onHeadCellClick(event) {
    if (this.props.onClickHeader) {
      this.props.onClickHeader(event.target.getAttribute('data-columns-name'));
    }
  },

  getExpandedRows: function getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getHeader: function getHeader(columns) {
    var _props = this.props;
    var showHeader = _props.showHeader;
    var expandIconAsCell = _props.expandIconAsCell;
    var prefixCls = _props.prefixCls;
    var expandIconColumnHeader = _props.expandIconColumnHeader;
    var sortColumn = _props.sortColumn;
    var orderBy = _props.orderBy;
    var sortable = _props.sortable;

    var ths = [];
    if (expandIconAsCell && expandIconColumnHeader) {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: prefixCls + '-expand-icon-th',
        title: ''
      });
    }
    ths = ths.concat(columns || this.getCurrentColumns()).map(function (c, index) {
      if (c.colSpan !== 0) {
        var sort = '';
        var th = undefined;
        if (expandIconAsCell && !expandIconColumnHeader && index === 0) {
          // if expand icon is rendered as icon and expandIconColumnHeader is false, we need to span second column header
          c.colSpan = c.colSpan || 1;
          c.colSpan += 1;
        }
        if (sortable === true) {
          if (sortColumn === c.dataIndex) {
            sort = orderBy === 0 ? 'asc' : 'desc';
          }
          th = _react2['default'].createElement(
            'th',
            {
              key: c.key,
              colSpan: c.colSpan,
              className: c.className || '',
              'data-columns-name': c.dataIndex,
              'data-sort-flag': sort
            },
            c.title
          );
        } else {
          th = _react2['default'].createElement(
            'th',
            {
              key: c.key,
              colSpan: c.colSpan,
              className: c.className || '',
              'data-columns-name': c.dataIndex
            },
            c.title
          );
        }
        return th;
      }
    });
    return showHeader ? _react2['default'].createElement(
      'thead',
      { className: prefixCls + '-thead', onClick: this.onHeadCellClick },
      _react2['default'].createElement(
        'tr',
        null,
        ths
      )
    ) : null;
  },

  getExpandedRow: function getExpandedRow(key, content, visible, className) {
    var prefixCls = this.props.prefixCls;
    return _react2['default'].createElement(
      'tr',
      { key: key + '-extra-row', style: { display: visible ? '' : 'none' },
        className: prefixCls + '-expanded-row ' + className },
      this.props.expandIconAsCell ? _react2['default'].createElement('td', { key: 'rc-table-expand-icon-placeholder' }) : '',
      _react2['default'].createElement(
        'td',
        { colSpan: this.props.columns.length },
        content
      )
    );
  },

  getRowsByData: function getRowsByData(data, visible, indent, columns) {
    var props = this.props;
    var childrenColumnName = props.childrenColumnName;
    var expandedRowRender = props.expandedRowRender;
    var expandIconAsCell = props.expandIconAsCell;
    var expandOnRowClick = props.expandOnRowClick;
    var rst = [];
    var keyFn = props.rowKey;
    var rowClassName = props.rowClassName;
    var rowRef = props.rowRef;
    var expandedRowClassName = props.expandedRowClassName;
    var needIndentSpaced = props.data.some(function (record) {
      return record[childrenColumnName] && record[childrenColumnName].length > 0;
    });
    var onRowClick = props.onRowClick;
    var expandIconColumnIndex = props.expandIconColumnIndex;
    var isAnyColumnsFixed = this.isAnyColumnsFixed();

    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var key = keyFn ? keyFn(record, i) : undefined;
      var childrenColumn = record[childrenColumnName];
      var isRowExpanded = this.isRowExpanded(record);
      var expandedRowContent = undefined;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i);
      }
      var className = rowClassName(record, i);
      if (this.state.currentHoverIndex === i) {
        className += ' ' + props.prefixCls + '-row-hover';
      }

      var onHoverProps = {};
      if (isAnyColumnsFixed) {
        onHoverProps.onHover = this.handleRowHover;
      }

      rst.push(_react2['default'].createElement(_TableRow2['default'], _extends({
        indent: indent,
        indentSize: props.indentSize,
        needIndentSpaced: needIndentSpaced,
        className: className,
        record: record,
        expandIconAsCell: expandIconAsCell,
        onDestroy: this.onRowDestroy,
        index: i,
        visible: visible,
        onExpand: this.onExpanded,
        expandable: childrenColumn || expandedRowRender,
        expanded: isRowExpanded,
        prefixCls: props.prefixCls + '-row',
        childrenColumnName: childrenColumnName,
        columns: columns || this.getCurrentColumns(),
        expandIconColumnIndex: expandIconColumnIndex,
        onRowClick: onRowClick
      }, onHoverProps, {
        key: key,
        expandOnRowClick: expandOnRowClick,
        ref: rowRef(record, i)
      })));

      var subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1));
      }
    }
    return rst;
  },

  getRows: function getRows(columns) {
    return this.getRowsByData(this.state.data, true, 0, columns);
  },

  getColGroup: function getColGroup(columns) {
    var cols = [];
    if (this.props.expandIconAsCell) {
      cols.push(_react2['default'].createElement('col', { className: this.props.prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
    }
    cols = cols.concat((columns || this.props.columns).map(function (c) {
      return _react2['default'].createElement('col', { key: c.key, style: { width: c.width } });
    }));
    return _react2['default'].createElement(
      'colgroup',
      null,
      cols
    );
  },

  getCurrentColumns: function getCurrentColumns() {
    var _this = this;

    var _props2 = this.props;
    var columns = _props2.columns;
    var columnsPageRange = _props2.columnsPageRange;
    var columnsPageSize = _props2.columnsPageSize;
    var prefixCls = _props2.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    if (!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map(function (column, i) {
      var newColumn = (0, _objectAssign2['default'])({}, column);
      if (i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        var pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        var pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if (pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if (i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = _this.wrapPageColumn(newColumn, i === pageIndexStart, i === pageIndexEnd);
      }
      return newColumn;
    });
  },

  getLeftFixedTable: function getLeftFixedTable() {
    var columns = this.props.columns;

    var fixedColumns = columns.filter(function (column) {
      return column.fixed === 'left' || column.fixed === true;
    });
    return this.getTable({
      columns: fixedColumns
    });
  },

  getRightFixedTable: function getRightFixedTable() {
    var columns = this.props.columns;

    var fixedColumns = columns.filter(function (column) {
      return column.fixed === 'right';
    });
    return this.getTable({
      columns: fixedColumns
    });
  },

  getTable: function getTable() {
    var _this2 = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var columns = options.columns;
    var _props3 = this.props;
    var prefixCls = _props3.prefixCls;
    var _props3$scroll = _props3.scroll;
    var scroll = _props3$scroll === undefined ? {} : _props3$scroll;
    var useFixedHeader = this.props.useFixedHeader;

    var bodyStyle = _extends({}, this.props.bodyStyle);

    var tableClassName = '';
    if (scroll.x || columns) {
      tableClassName = prefixCls + '-fixed';
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
    }

    if (scroll.y) {
      bodyStyle.height = bodyStyle.height || scroll.y;
      bodyStyle.overflowY = bodyStyle.overflowY || 'auto';
      useFixedHeader = true;
    }

    var renderTable = function renderTable() {
      var hasHead = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var hasBody = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var tableStyle = {};
      if (!options.columns && scroll.x) {
        tableStyle.width = scroll.x;
      }
      return _react2['default'].createElement(
        'table',
        { className: tableClassName, style: tableStyle },
        _this2.getColGroup(options.columns),
        hasHead ? _this2.getHeader(options.columns) : null,
        hasBody ? _react2['default'].createElement(
          'tbody',
          { className: prefixCls + '-tbody' },
          _this2.getRows(options.columns)
        ) : null
      );
    };

    var headTable = undefined;
    if (useFixedHeader) {
      headTable = _react2['default'].createElement(
        'div',
        {
          className: prefixCls + '-header',
          ref: columns ? null : 'headTable' },
        renderTable(true, false)
      );
    }

    var BodyTable = _react2['default'].createElement(
      'div',
      {
        className: prefixCls + '-body',
        style: bodyStyle,
        ref: 'bodyTable',
        onMouseEnter: this.detectScrollTarget,
        onScroll: this.handleBodyScroll },
      renderTable(!useFixedHeader)
    );

    if (columns && columns.length) {
      var refName = undefined;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      BodyTable = _react2['default'].createElement(
        'div',
        {
          className: prefixCls + '-body-outer',
          style: _extends({}, bodyStyle, { overflow: 'hidden' }) },
        _react2['default'].createElement(
          'div',
          {
            className: prefixCls + '-body-inner',
            ref: refName,
            onMouseEnter: this.detectScrollTarget,
            onScroll: this.handleBodyScroll },
          renderTable(!useFixedHeader)
        )
      );
    }

    return _react2['default'].createElement(
      'span',
      null,
      headTable,
      BodyTable
    );
  },

  getFooter: function getFooter() {
    var _props4 = this.props;
    var footer = _props4.footer;
    var prefixCls = _props4.prefixCls;

    return footer ? _react2['default'].createElement(
      'div',
      { className: prefixCls + '-footer' },
      footer(this.state.data)
    ) : null;
  },

  getMaxColumnsPage: function getMaxColumnsPage() {
    var _props5 = this.props;
    var columnsPageRange = _props5.columnsPageRange;
    var columnsPageSize = _props5.columnsPageSize;

    return Math.floor((columnsPageRange[1] - columnsPageRange[0] - 1) / columnsPageSize);
  },

  goToColumnsPage: function goToColumnsPage(currentColumnsPage) {
    var maxColumnsPage = this.getMaxColumnsPage();
    var page = currentColumnsPage;
    if (page < 0) {
      page = 0;
    }
    if (page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page
    });
  },

  prevColumnsPage: function prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage: function nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn: function wrapPageColumn(column, hasPrev, hasNext) {
    var prefixCls = this.props.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    var maxColumnsPage = this.getMaxColumnsPage();
    var prevHandlerCls = prefixCls + '-prev-columns-page';
    if (currentColumnsPage === 0) {
      prevHandlerCls += ' ' + prefixCls + '-prev-columns-page-disabled';
    }
    var prevHandler = _react2['default'].createElement('span', { className: prevHandlerCls, onClick: this.prevColumnsPage });
    var nextHandlerCls = prefixCls + '-next-columns-page';
    if (currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ' ' + prefixCls + '-next-columns-page-disabled';
    }
    var nextHandler = _react2['default'].createElement('span', { className: nextHandlerCls, onClick: this.nextColumnsPage });
    if (hasPrev) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        prevHandler,
        column.title
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-prev');
    }
    if (hasNext) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        column.title,
        nextHandler
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-next');
    }
    return column;
  },

  findExpandedRow: function findExpandedRow(record) {
    var _this3 = this;

    var rows = this.getExpandedRows().filter(function (i) {
      return i === _this3.props.rowKey(record);
    });
    return rows[0];
  },

  isRowExpanded: function isRowExpanded(record) {
    return !!this.findExpandedRow(record);
  },

  detectScrollTarget: function detectScrollTarget(e) {
    this.scrollTarget = e.currentTarget;
  },

  isAnyColumnsFixed: function isAnyColumnsFixed() {
    return this.getCurrentColumns().some(function (column) {
      return !!column.fixed;
    });
  },

  isAnyColumnsLeftFixed: function isAnyColumnsLeftFixed() {
    return this.getCurrentColumns().some(function (column) {
      return column.fixed === 'left' || column.fixed === true;
    });
  },

  isAnyColumnsRightFixed: function isAnyColumnsRightFixed() {
    return this.getCurrentColumns().some(function (column) {
      return column.fixed === 'right';
    });
  },

  handleBodyScroll: function handleBodyScroll(e) {
    // Prevent scrollTop setter trigger onScroll event
    // http://stackoverflow.com/q/1386696
    if (e.target !== this.scrollTarget) {
      return;
    }
    var scroll = this.props.scroll || {};
    if (scroll.x && e.target === this.refs.bodyTable) {
      if (this.refs.headTable) {
        this.refs.headTable.scrollLeft = e.target.scrollLeft;
      }
      if (e.target.scrollLeft === 0) {
        this.setState({ scrollPosition: 'left' });
      } else if (e.target.scrollLeft >= e.target.children[0].offsetWidth - e.target.offsetWidth) {
        this.setState({ scrollPosition: 'right' });
      } else if (this.state.scrollPosition !== 'middle') {
        this.setState({ scrollPosition: 'middle' });
      }
    }
    if (scroll.y) {
      if (this.refs.fixedColumnsBodyLeft) {
        this.refs.fixedColumnsBodyLeft.scrollTop = e.target.scrollTop;
      }
      if (this.refs.fixedColumnsBodyRight) {
        this.refs.fixedColumnsBodyRight.scrollTop = e.target.scrollTop;
      }
      if (this.refs.bodyTable) {
        this.refs.bodyTable.scrollTop = e.target.scrollTop;
      }
    }
  },

  handleRowHover: function handleRowHover(isHover, index) {
    if (isHover) {
      this.setState({
        currentHoverIndex: index
      });
    } else {
      this.setState({
        currentHoverIndex: null
      });
    }
  },

  render: function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;

    var className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    if (props.columnsPageRange) {
      className += ' ' + prefixCls + '-columns-paging';
    }
    if (props.useFixedHeader || props.scroll && props.scroll.y) {
      className += ' ' + prefixCls + '-fixed-header';
    }
    className += ' ' + prefixCls + '-scroll-position-' + this.state.scrollPosition;

    return _react2['default'].createElement(
      'div',
      { className: className, style: props.style },
      this.isAnyColumnsLeftFixed() && _react2['default'].createElement(
        'div',
        { className: prefixCls + '-fixed-left' },
        this.getLeftFixedTable()
      ),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-scroll' },
        this.getTable(),
        this.getFooter()
      ),
      this.isAnyColumnsRightFixed() && _react2['default'].createElement(
        'div',
        { className: prefixCls + '-fixed-right' },
        this.getRightFixedTable()
      )
    );
  }
});

exports['default'] = Table;
module.exports = exports['default'];