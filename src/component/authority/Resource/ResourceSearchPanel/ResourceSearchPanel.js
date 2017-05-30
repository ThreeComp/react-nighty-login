/**
 * Created by chenchao on 17/5/8.
 */

import React from 'react';
import './ResourceSearchPanel.css';
import SearchPanel from '../../../common/SearchPanel/SearchPanel';

class ResourceSearchPanel extends React.Component {
    constructor(props){
        super(props);
        var {} = this.props;
        this.state = {
        }
    }

    render() {
        var result;
        var onSearch = function (values) {
            console.log(values);
        };
        var fields = [
            {
                key: "name",
                label: "姓名"
            },
            {
                key: "age",
                label: "年龄"
            },
            {
                key: "sex",
                label: "性别",
                render: () => {
                    return (
                        <select id="sex" name="sex" className="form-control">
                            <option value={0}>女</option>
                            <option value={1}>男</option>
                        </select>
                    )
                }
            },
        ];
        result = (
            <div>
                <h3>查询</h3>
                <SearchPanel fields={fields} onSearch={onSearch}/>
            </div>
        );
        return result;
    }
}

//导出组件
export default ResourceSearchPanel;