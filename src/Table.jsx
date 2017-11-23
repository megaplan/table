import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import TableRow from './TableRow';
import objectAssign from 'object-assign';

const Table = createReactClass({
  propTypes: {
    data: PropTypes.array,
    expandIconAsCell: PropTypes.bool,
    expandIconColumnHeader: PropTypes.bool,
    expandOnRowClick: PropTypes.bool,
    defaultExpandAllRows: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    defaultExpandedRowKeys: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    style: PropTypes.object,
    rowKey: PropTypes.func,
    rowClassName: PropTypes.func,
    expandedRowClassName: PropTypes.func,
    childrenColumnName: PropTypes.string,
    onExpandedRowsChange: PropTypes.func,
    indentSize: PropTypes.number,
    onRowClick: PropTypes.func,
    columnsPageRange: PropTypes.array,
    columnsPageSize: PropTypes.number,
    expandIconColumnIndex: PropTypes.number,
    showHeader: PropTypes.bool,
    footer: PropTypes.func,
    scroll: PropTypes.object,
    onClickHeader: PropTypes.func,
    sortColumn: PropTypes.string,
    orderBy: PropTypes.number,
    rowRef: PropTypes.func,
    sortable: PropTypes.bool
  },

  getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      expandIconColumnHeader: true,
      expandOnRowClick: false,
      columns: [],
      defaultExpandAllRows: false,
      defaultExpandedRowKeys: [],
      rowKey(o) {
        return o.key;
      },
      rowClassName() {
        return '';
      },
      expandedRowClassName() {
        return '';
      },
      onExpandedRowsChange() {
      },
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true,
      scroll: {},
      rowRef() {
        return null;
      },
    };
  },

  getInitialState() {
    const props = this.props;
    let expandedRowKeys = [];
    let rows = [...props.data];
    if(props.defaultExpandAllRows) {
      for(let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if(row[props.childrenColumnName] && row[props.childrenColumnName].length > 0) {
          expandedRowKeys.push(props.rowKey(row));
          rows = rows.concat(row[props.childrenColumnName]);
        }
      }
    } else {
      expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
    }
    return {
      expandedRowKeys,
      data: props.data,
      currentColumnsPage: 0,
      currentHoverIndex: null,
      scrollPosition: 'left',
    };
  },

  componentDidMount() {
    if(this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if(this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
  },

  componentWillReceiveProps(nextProps) {
    if('data' in nextProps) {
      this.setState({
        data: nextProps.data,
      });
    }
    if('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys,
      });
    }
  },

  onExpandedRowsChange(expandedRowKeys) {
    if(!this.props.expandedRowKeys) {
      this.setState({
        expandedRowKeys: expandedRowKeys,
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded(expanded, record, event) {
    const info = this.findExpandedRow(record);
    if(info && !expanded) {
      this.onRowDestroy(record);
    } else if(!info && expanded) {
      const expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.props.rowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
    event.stopPropagation();
  },

  onRowDestroy(record) {
    const expandedRows = this.getExpandedRows().concat();
    const rowKey = this.props.rowKey(record);
    let index = -1;
    expandedRows.forEach((r, i) => {
      if(r === rowKey) {
        index = i;
      }
    });
    if(index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  onHeadCellClick(event) {
    if(this.props.onClickHeader && this.props.sortable === true) {
      this.props.onClickHeader(event.target.getAttribute('data-columns-name'));
    }
  },

  getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getHeader(columns) {
    const { showHeader,
      expandIconAsCell,
      prefixCls,
      expandIconColumnHeader,
      sortColumn,
      orderBy,
      sortable
      } = this.props;
    let ths = [];
    if(expandIconAsCell && expandIconColumnHeader) {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: `${prefixCls}-expand-icon-th`,
        title: '',
      });
    }
    ths = ths.concat(columns || this.getCurrentColumns()).map((c, index) => {
      if(c.colSpan !== 0) {
        let sort = '';
        let th;
        if(expandIconAsCell && !expandIconColumnHeader && index === 0) {
          // if expand icon is rendered as icon and expandIconColumnHeader is false, we need to span second column header
          c.colSpan = c.colSpan || 1;
          c.colSpan += 1;
        }
        if(sortable === true) {
          if(sortColumn === c.dataIndex) {
            sort = orderBy === 0 ? 'asc' : 'desc';
          }
          th = (<th
            key={c.key}
            colSpan={c.colSpan}
            className={c.className || ''}
            data-columns-name={c.dataIndex}
            data-sort-flag={sort}
          >
            {c.title}
          </th>)
        } else {
          th = (
            <th
              key={c.key}
              colSpan={c.colSpan}
              className={c.className || ''}
              data-columns-name={c.dataIndex}
            >
              {c.title}
            </th>)
        }
        return th
      }
    });
    return showHeader ? (
      <thead className={`${prefixCls}-thead`} onClick={this.onHeadCellClick}>
      <tr>{ths}</tr>
      </thead>
    ) : null;
  },

  getExpandedRow(key, content, visible, className) {
    const prefixCls = this.props.prefixCls;
    return (<tr key={key + '-extra-row'} style={{display: visible ? '' : 'none'}}
                className={`${prefixCls}-expanded-row ${className}`}>
      {this.props.expandIconAsCell ? <td key="rc-table-expand-icon-placeholder"></td> : ''}
      <td colSpan={this.props.columns.length}>
        {content}
      </td>
    </tr>);
  },

  getRowsByData(data, visible, indent, columns) {
    const props = this.props;
    const childrenColumnName = props.childrenColumnName;
    const expandedRowRender = props.expandedRowRender;
    const expandIconAsCell = props.expandIconAsCell;
    const expandOnRowClick = props.expandOnRowClick;
    let rst = [];
    const keyFn = props.rowKey;
    const rowClassName = props.rowClassName;
    const rowRef = props.rowRef;
    const expandedRowClassName = props.expandedRowClassName;
    const needIndentSpaced = props.data.some(record =>
    record[childrenColumnName] && record[childrenColumnName].length > 0);
    const onRowClick = props.onRowClick;
    const expandIconColumnIndex = props.expandIconColumnIndex;
    const isAnyColumnsFixed = this.isAnyColumnsFixed();

    for(let i = 0; i < data.length; i++) {
      const record = data[i];
      const key = keyFn ? keyFn(record, i) : undefined;
      const childrenColumn = record[childrenColumnName];
      const isRowExpanded = this.isRowExpanded(record);
      let expandedRowContent;
      if(expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i);
      }
      let className = rowClassName(record, i);
      if(this.state.currentHoverIndex === i) {
        className += ' ' + props.prefixCls + '-row-hover';
      }

      const onHoverProps = {};
      if(isAnyColumnsFixed) {
        onHoverProps.onHover = this.handleRowHover;
      }

      rst.push(
        <TableRow
          indent={indent}
          indentSize={props.indentSize}
          needIndentSpaced={needIndentSpaced}
          className={className}
          record={record}
          expandIconAsCell={expandIconAsCell}
          onDestroy={this.onRowDestroy}
          index={i}
          visible={visible}
          onExpand={this.onExpanded}
          expandable={childrenColumn || expandedRowRender}
          expanded={isRowExpanded}
          prefixCls={`${props.prefixCls}-row`}
          childrenColumnName={childrenColumnName}
          columns={columns || this.getCurrentColumns()}
          expandIconColumnIndex={expandIconColumnIndex}
          onRowClick={onRowClick}
          { ...onHoverProps }
          key={key}
          expandOnRowClick={expandOnRowClick}
          ref={rowRef(record, i)}
        />
      );

      const subVisible = visible && isRowExpanded;

      if(expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if(childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1));
      }
    }
    return rst;
  },

  getRows(columns) {
    return this.getRowsByData(this.state.data, true, 0, columns);
  },

  getColGroup(columns) {
    let cols = [];
    if(this.props.expandIconAsCell) {
      cols.push(<col className={`${this.props.prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col"></col>);
    }
    cols = cols.concat((columns || this.props.columns).map(c => {
      return <col key={c.key} style={{width: c.width}}/>;
    }));
    return <colgroup>{cols}</colgroup>;
  },

  getCurrentColumns() {
    const { columns, columnsPageRange, columnsPageSize, prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    if(!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map((column, i) => {
      let newColumn = objectAssign({}, column);
      if(i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        const pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        let pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if(pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if(i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = this.wrapPageColumn(newColumn, (i === pageIndexStart), (i === pageIndexEnd));
      }
      return newColumn;
    });
  },

  getLeftFixedTable() {
    const { columns } = this.props;
    const fixedColumns = columns.filter(
      column => column.fixed === 'left' || column.fixed === true
    );
    return this.getTable({
      columns: fixedColumns,
    });
  },

  getRightFixedTable() {
    const { columns } = this.props;
    const fixedColumns = columns.filter(column => column.fixed === 'right');
    return this.getTable({
      columns: fixedColumns,
    });
  },

  getTable(options = {}) {
    const { columns } = options;
    const { prefixCls, scroll = {} } = this.props;
    let { useFixedHeader } = this.props;
    const bodyStyle = {...this.props.bodyStyle};

    let tableClassName = '';
    if(scroll.x || columns) {
      tableClassName = `${prefixCls}-fixed`;
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
    }

    if(scroll.y) {
      bodyStyle.height = bodyStyle.height || scroll.y;
      bodyStyle.overflowY = bodyStyle.overflowY || 'auto';
      useFixedHeader = true;
    }

    const renderTable = (hasHead = true, hasBody = true) => {
      const tableStyle = {};
      if(!options.columns && scroll.x) {
        tableStyle.width = scroll.x;
      }
      return (
        <table className={tableClassName} style={tableStyle}>
          {this.getColGroup(options.columns)}
          {hasHead ? this.getHeader(options.columns) : null}
          {hasBody ? <tbody className={`${prefixCls}-tbody`}>
          {this.getRows(options.columns)}
          </tbody> : null}
        </table>
      );
    };

    let headTable;
    if(useFixedHeader) {
      headTable = (
        <div
          className={`${prefixCls}-header`}
          ref={columns ? null : 'headTable'}>
          {renderTable(true, false)}
        </div>
      );
    }

    let BodyTable = (
      <div
        className={`${prefixCls}-body`}
        style={bodyStyle}
        ref="bodyTable"
        onMouseEnter={this.detectScrollTarget}
        onScroll={this.handleBodyScroll}>
        {renderTable(!useFixedHeader)}
      </div>
    );

    if(columns && columns.length) {
      let refName;
      if(columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if(columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      BodyTable = (
        <div
          className={`${prefixCls}-body-outer`}
          style={{ ...bodyStyle, overflow: 'hidden' }}>
          <div
            className={`${prefixCls}-body-inner`}
            ref={refName}
            onMouseEnter={this.detectScrollTarget}
            onScroll={this.handleBodyScroll}>
            {renderTable(!useFixedHeader)}
          </div>
        </div>
      );
    }

    return <span>{headTable}{BodyTable}</span>;
  },

  getFooter() {
    const { footer, prefixCls } = this.props;
    return footer ? (
      <div className={`${prefixCls}-footer`}>
        {footer(this.state.data)}
      </div>
    ) : null;
  },

  getMaxColumnsPage() {
    const { columnsPageRange, columnsPageSize } = this.props;
    return Math.floor((columnsPageRange[1] - columnsPageRange[0] - 1) / columnsPageSize);
  },

  goToColumnsPage(currentColumnsPage) {
    const maxColumnsPage = this.getMaxColumnsPage();
    let page = currentColumnsPage;
    if(page < 0) {
      page = 0;
    }
    if(page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page,
    });
  },

  prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn(column, hasPrev, hasNext) {
    const { prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    const maxColumnsPage = this.getMaxColumnsPage();
    let prevHandlerCls = `${prefixCls}-prev-columns-page`;
    if(currentColumnsPage === 0) {
      prevHandlerCls += ` ${prefixCls}-prev-columns-page-disabled`;
    }
    const prevHandler = <span className={prevHandlerCls} onClick={this.prevColumnsPage}></span>;
    let nextHandlerCls = `${prefixCls}-next-columns-page`;
    if(currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ` ${prefixCls}-next-columns-page-disabled`;
    }
    const nextHandler = <span className={nextHandlerCls} onClick={this.nextColumnsPage}></span>;
    if(hasPrev) {
      column.title = <span>{prevHandler}{column.title}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-prev`;
    }
    if(hasNext) {
      column.title = <span>{column.title}{nextHandler}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-next`;
    }
    return column;
  },

  findExpandedRow(record) {
    const rows = this.getExpandedRows().filter(i => i === this.props.rowKey(record));
    return rows[0];
  },

  isRowExpanded(record) {
    return !!this.findExpandedRow(record);
  },

  detectScrollTarget(e) {
    this.scrollTarget = e.currentTarget;
  },

  isAnyColumnsFixed() {
    return this.getCurrentColumns().some(column => !!column.fixed);
  },

  isAnyColumnsLeftFixed() {
    return this.getCurrentColumns().some(
      column => column.fixed === 'left' || column.fixed === true
    );
  },

  isAnyColumnsRightFixed() {
    return this.getCurrentColumns().some(column => column.fixed === 'right');
  },

  handleBodyScroll(e) {
    // Prevent scrollTop setter trigger onScroll event
    // http://stackoverflow.com/q/1386696
    if(e.target !== this.scrollTarget) {
      return;
    }
    const scroll = this.props.scroll || {};
    if(scroll.x && e.target === this.refs.bodyTable) {
      if(this.refs.headTable) {
        this.refs.headTable.scrollLeft = e.target.scrollLeft;
      }
      if(e.target.scrollLeft === 0) {
        this.setState({scrollPosition: 'left'});
      } else if(e.target.scrollLeft >= e.target.children[0].offsetWidth - e.target.offsetWidth) {
        this.setState({scrollPosition: 'right'});
      } else if(this.state.scrollPosition !== 'middle') {
        this.setState({scrollPosition: 'middle'});
      }
    }
    if(scroll.y) {
      if(this.refs.fixedColumnsBodyLeft) {
        this.refs.fixedColumnsBodyLeft.scrollTop = e.target.scrollTop;
      }
      if(this.refs.fixedColumnsBodyRight) {
        this.refs.fixedColumnsBodyRight.scrollTop = e.target.scrollTop;
      }
      if(this.refs.bodyTable) {
        this.refs.bodyTable.scrollTop = e.target.scrollTop;
      }
    }
  },

  handleRowHover(isHover, index) {
    if(isHover) {
      this.setState({
        currentHoverIndex: index,
      });
    } else {
      this.setState({
        currentHoverIndex: null,
      });
    }
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;

    let className = props.prefixCls;
    if(props.className) {
      className += ' ' + props.className;
    }
    if(props.columnsPageRange) {
      className += ` ${prefixCls}-columns-paging`;
    }
    if(props.useFixedHeader || (props.scroll && props.scroll.y)) {
      className += ` ${prefixCls}-fixed-header`;
    }
    className += ` ${prefixCls}-scroll-position-${this.state.scrollPosition}`;

    return (
      <div className={className} style={props.style}>
        {this.isAnyColumnsLeftFixed() &&
        <div className={`${prefixCls}-fixed-left`}>
          {this.getLeftFixedTable()}
        </div>}
        <div className={`${prefixCls}-scroll`}>
          {this.getTable()}
          {this.getFooter()}
        </div>
        {this.isAnyColumnsRightFixed() &&
        <div className={`${prefixCls}-fixed-right`}>
          {this.getRightFixedTable()}
        </div>}
      </div>
    );
  },
});

export default Table;
