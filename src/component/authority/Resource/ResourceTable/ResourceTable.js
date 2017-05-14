/**
 * Created by chenchao on 17/5/8.
 */

import React from 'react';
import './ResourceTable.css';
import {Table, Pagination, Popconfirm, Button, Form, Input, Row, Col} from 'antd';

class ResourceTable extends React.Component {
    constructor(props){
        super(props);
        var {} = this.props;
        this.state = {
        }
    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                render: (text, record) => (
                    <OperationModal
                        record={record}
                        title="查看"
                        operationType='check'
                        dataModel={dataModel}
                    >
                        <a>{text}</a>
                    </OperationModal>
                ),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: '20%',
            },
            {
                title: 'Sex',
                dataIndex: 'sex',
                key: 'sex',
                width: '20%',
                render: (text) => (
                    <span>{sexTrans[text]}</span>
                ),
            },
            {
                title: 'Operation',
                key: 'operation',
                width: '30%',
                render: (text, record) => (
                    <span className={styles.operation}>
          <OperationModal
              record={record}
              onOk={editHandler}
              title="Edit"
              operationType='edit'
              dataModel={dataModel}
          >
            <a>Edit</a>
          </OperationModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.name)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
                ),
            },
        ];
        var result;
        result = (
            <div>
                ResourceTable
            </div>
        );
        return result;
    }
}

//导出组件
export default ResourceTable;