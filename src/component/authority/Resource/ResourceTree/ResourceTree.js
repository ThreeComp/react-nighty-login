/**
 * Created by chenchao on 17/5/8.
 */

import React from 'react';
import './ResourceTree.css';
import Tree from '../../../common/Tree/Tree';

class ResourceTree extends React.Component {
    render() {
        var dataList = [];
        $.ajax({
            type: 'GET',
            async: false,
            url: "http://localhost:8081/resource/allAdminResources",
            error: function () {
                alert("请求失败");
            },
            success: function (result) {
                var data = result.data;
                dataList = data.map(function (item) {
                    return {
                        id:item.id,
                        pId:item.parentId,
                        name:item.name,
                    }
                });
            }
        });
        var result;
        var onSelect = function (selectedKey) {
            console.log(selectedKey);
        };
        var onCheck = function (currentNode, checkedIds) {
            console.log(currentNode);
            console.log(checkedIds);
        };
        let params = {
            dataList,
            checkable: true,
            searchable: true,
            onCheck,
            checkedKeys: ["201705092125"],
        };
        // var that = this;
        // $(function () {
        //     var tree = that.refs.tree;
        //     tree.addNode({id:'11',pId:'0',name:'test'});
        //     tree.deleteNode('11');
        // });
        result = (
            <div>
                <Tree ref="tree" {...params}></Tree>
            </div>
        );
        return result;
    }
}

//导出组件
export default ResourceTree;