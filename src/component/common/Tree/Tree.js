/**
 * Created by chenchao on 17/5/10.
 */

import React from 'react';
import styles from './Tree.css';

class nTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tree: null,
            dataList: props.dataList || [],
            expandedKeys: props.expandedKeys || [],
            checkedKeys: props.checkedKeys || [],
            selectedKey: props.selectedKey,
        };
    }

    onCheck = (currentNode, checkedKeys) => {
        const onChecked = this.props.onCheck || function(currentNode, checkedKeys) {};
        onChecked(currentNode, checkedKeys);
    };

    onSelect = (selectedKey) => {
        const onSelected = this.props.onSelect || function(selectedKey) {};
        onSelected(selectedKey);
    };

    detectEnter(event) {
        var e = event || window.event;
        var o = e.target || e.srcElement;
        var keyCode = e.keyCode || e.which; // 按键的keyCode
        if (keyCode == 13) {
            e.keyCode = 9;
            e.returnValue = false;
            $('#searchBtn').click();
        }
    }

    checkNodes = () => {
        for(var i = 0; i < this.state.checkedKeys.length; i++){
            var node = this.state.tree.getNodeByParam("id", this.state.checkedKeys[i], null);
            if(node != null && (!node.children || node.children.length == 0))
                this.state.tree.checkNode(node,true,true,false);
        }
    };

    heightLightNodes = (nodes) => {
        if (nodes !== null && nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                node.highlight = true;
                this.state.tree.updateNode(node);
                this.state.tree.expandNode(node.getParentNode(), true);
                if (node.isParent) {
                    this.state.tree.expandNode(node, true);
                }
            }
        }
    };

    updateTree = () => {

    };

    initTree = () => {
        let that = this;
        let tree = this.state.tree;
        var dataList = this.state.dataList;
        var checkable = this.props.checkable || false;
        var searchable = this.props.searchable || false;
        var idKey = this.props.idKey || 'id';
        var pIdKey = this.props.pIdKey || 'pId';
        var nameKey = this.props.nameKey || 'name';
        const setting = {
            view : {
                selectedMulti : false,
                dblClickExpand : false,
                fontCss : function (treeId, treeNode) {
                    return (!!treeNode.highlight) ? {
                        color : '#A60000',
                        "font-weight" : "bold"
                    } : {
                        color : "#333",
                        "font-weight" : "normal"
                    };
                }
            },
            check: {
                enable: checkable,
                chkStyle: "checkbox",
                nocheck: false,
            },
            data: {
                simpleData : {
                    enable : true,
                    idKey : idKey,
                    pIdKey : pIdKey,
                },
                key : {
                    name : nameKey
                }
            },
            callback : {
                beforeClick:function(id, node){
                    if (checkable){
                        tree.checkNode(node, !node.checked, true, true);
                        return false;
                    }
                },
                onCheck : function(event, treeId, treeNode){
                    if (checkable){
                        var checkedNodes = tree.getCheckedNodes(true);
                        var checkedNodeIds = [];
                        for(var i = 0; i < checkedNodes.length; i++){
                            if(checkedNodes[i].check_Child_State != '1') //等于1表示部分子节点勾选
                                checkedNodeIds.push(checkedNodes[i].id);
                        }
                        that.state.checkedKeys = checkedNodeIds;
                        that.onCheck(treeNode, checkedNodeIds);
                        console.log("checkedKeys",that.state.checkedKeys);
                    }
                },
                onClick: function (event, treeId, treeNode) {
                    if (!checkable){
                        that.state.selectedKey = treeNode.id;
                        that.onSelect(treeNode.id);
                    }
                }
            }
        };

        this.state.tree = $.fn.zTree.init($("#tree"), setting, dataList);
        //初始化时显示勾选的节点
        that.checkNodes();
        var nodes = this.state.tree.getCheckedNodes(true);
        that.heightLightNodes(nodes);

        if (searchable){
            $("#searchBtn").click(function() {
                var keyWord = $("#searchWord").val();
                if ($.isEmptyObject(keyWord)) {
                    return;
                }
                tree = $.fn.zTree.init($("#tree"), setting, dataList);
                that.checkNodes();
                var nodes = tree.getNodesByParamFuzzy("name", keyWord);
                that.heightLightNodes(nodes);
            });
            if (checkable){
                $("#showSelected").click(function() {
                    tree = $.fn.zTree.init($("#tree"), setting, dataList);
                    that.checkNodes();
                    var nodes = tree.getCheckedNodes(true);
                    that.heightLightNodes(nodes);
                });
            }//设置回车搜索
            $('#searchWord').keypress(function (e) { that.detectEnter(e); });
        }
    };

    deleteNode = (nodeId) => {
        for(var i = 0; i < this.state.dataList.length; i++){
            if (this.state.dataList[i][this.props.idKey || 'id'] == nodeId){
                this.state.dataList.splice(i--, 1);
                break;
            }
        }
        this.initTree();
    };

    addNode = (data) => {
        this.state.dataList.push(data);
        this.initTree();
    };

    render() {
        var that = this;
        var dataList = this.state.dataList;
        var checkable = this.props.checkable || false;
        var searchable = this.props.searchable || false;
        var tree = this.state.tree;
        $(function () {
            that.initTree();
        });
        let result;
        if (searchable){
            if (checkable){
                result = (
                    <div>
                        <div>
                            <div className="row">
                                <div className="col-xs-10">
                                    <div className="input-group">
                                        <input id="searchWord" name="searchWord" type="text"
                                               className="form-control" />
                                        <div className="input-group-btn">
                                            <button type="button" id="searchBtn"
                                                    className="btn btn-default ">
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                <div className="">
                                    <button type="button" id="showSelected" className="btn btn-default">
                                        <i className="fa fa-check-square-o"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <ul id="tree" className="ztree"></ul>
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                result = (
                    <div>
                        <div>
                            <div className="row">
                                <div className="input-group">
                                    <input id="searchWord" name="searchWord" type="text"
                                           className="form-control" />
                                    <div className="input-group-btn">
                                        <button type="button" id="searchBtn"
                                                className="btn btn-default ">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <ul id="tree" className="ztree"></ul>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        else {
            result = (
                <div className="row">
                    <ul id="tree" className="ztree"></ul>
                </div>
            )
        }
        return result;
    }
}

export default nTree;