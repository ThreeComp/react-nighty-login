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
        var searchParams = {
            keys: ['name', 'age', {key: 'sex', transform: {"1": "男", "2": "女"}}],
            labels: ['Name', 'Age', 'Sex']
        };
        result = (
            <div>
                <h3>查询</h3>
                <SearchPanel searchParams={searchParams} onSearch={onSearch}/>
            </div>
        );
        return result;
    }
}

//导出组件
export default ResourceSearchPanel;