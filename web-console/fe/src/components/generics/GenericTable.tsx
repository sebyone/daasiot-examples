/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: GenericTable.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ColumnType, GenericTableProps, TableDataType } from '@/types';
import { Button, Table } from 'antd';
import Search from 'antd/es/input/Search';
import { Component, ReactNode } from 'react';
import ActionsButton from '../ActionsButton';

const defaultStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  maxWidth: '100%',
  minWidth: '0',
  alignItems: 'flex-end',
};

const style_div = { display: 'flex', alignItems: 'flex-start', width: '30%', marginTop: -10 };

const filterColumns = (columns: ColumnType[], excludeColumns: string[] = []) => {
  return columns.filter((column) => !excludeColumns.includes(column.dataIndex));
};

class GenericTable<T extends TableDataType> extends Component<GenericTableProps<T>> {
  getActionColumn(): ColumnType {
    const { confirm } = this.props;
    return {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <ActionsButton data={record} onEdit={this.props.onRowClick} onDelete={() => this.props.confirm(record)} />
      ),
    };
  }

  getActionColumnWithOpenModal(): ColumnType {
    const { confirm, onOpenModal } = this.props;
    return {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <ActionsButton
          data={record}
          onEdit={this.props.onRowClick}
          onDelete={() => this.props.confirm(record)}
          onOpenModal={onOpenModal}
          showOpenModal={true}
        />
      ),
    };
  }

  getFilteredColumns() {
    const { columns, excludeColumns, onOpenModal } = this.props;
    const defaultColumns = this.getDefaultColumns();
    const actionColumn = onOpenModal ? this.getActionColumnWithOpenModal() : this.getActionColumn();
    return [...filterColumns(columns || defaultColumns, excludeColumns), actionColumn];
  }

  getDefaultColumns(): ColumnType[] {
    return [];
  }

  paginationConfig = {
    pageSize: 10,
  };

  render(): ReactNode {
    const {
      items,
      handleClick,
      showButton,
      rowKey,
      route,
      handleSearchChange,
      handleEventSearchChange,
      onRowClick,
      onOpenModal,
    } = this.props;
    const columns = this.getFilteredColumns();
    const pagination = this.paginationConfig;

    return (
      <>
        <div style={style_div}>
          <Search
            placeholder="Cerca"
            size="small"
            onSearch={handleSearchChange}
            onChange={handleEventSearchChange}
            style={{ marginBottom: 10 }}
          ></Search>
        </div>
        <div style={defaultStyle}>
          <Table
            columns={columns}
            dataSource={items}
            pagination={pagination}
            scroll={{ y: 150 }}
            style={{ width: '100%' }}
            size="small"
            onRow={(record) => {
              return {
                onClick: () => {
                  onRowClick(record);
                },
              };
            }}
            rowKey={rowKey}
          />
          {showButton && (
            <Button type="primary" style={{ marginTop: '1px' }} onClick={handleClick}>
              Aggiungi
            </Button>
          )}
        </div>
      </>
    );
  }
}

export default GenericTable;
