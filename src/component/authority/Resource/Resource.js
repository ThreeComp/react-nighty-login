/**
 * Created by chenchao on 17/5/8.
 */

import React from 'react';
import './Resource.css';
import ResourceTree from './ResourceTree/ResourceTree';
import ResourceSearchPanel from './ResourceSearchPanel/ResourceSearchPanel';
import ResourceTable from './ResourceTable/ResourceTable';

class Resource extends React.Component {
    render() {
        return (
            <div>
                <div className="col-lg-3">
                    <ResourceTree />
                </div>
                <div className="col-lg-9">
                    <ResourceSearchPanel />
                    <ResourceTable />
                </div>

            </div>
        );
    }
}

//导出组件
export default Resource;