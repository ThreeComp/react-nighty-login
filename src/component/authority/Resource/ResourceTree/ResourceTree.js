/**
 * Created by chenchao on 17/5/8.
 */

import React from 'react';
import './ResourceTree.css';

class ResourceTree extends React.Component {
    constructor(props){
        super(props);
        var {} = this.props;
        this.state = {
        }
    }

    render() {
        var result;
        var resourceTree = {
            setting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                }
            },
            resourceTreeNodes: [],
            initData: function (url) {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: url,
                    error: function () {
                        alert("请求失败");
                    },
                    success: function (result) {
                        var data = result.data;
                        resourceTree.resourceTreeNodes = data.map(function (item) {
                            return {
                                id:item.id,
                                pId:item.parentId,
                                name:item.name,
                            }
                        });
                    }
                });
            },
            initTree: function (domId) {
                $.fn.zTree.init($("#" + domId), resourceTree.setting, resourceTree.resourceTreeNodes);
            }
        };
        $(function () {
            resourceTree.initData("http://localhost:8081/resource/allAdminResources");
            resourceTree.initTree("resourceTree");
        });
        result = (
            <div>
                <ul id="resourceTree" className="ztree"></ul>
            </div>
        );
        return result;
    }
}

//导出组件
export default ResourceTree;