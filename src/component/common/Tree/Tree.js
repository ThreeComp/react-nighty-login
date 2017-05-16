/**
 * Created by chenchao on 17/5/10.
 */

import React,{Component,PropTypes} from 'react';
import './Tree.css';

/**
 * 单选树/多选树
 * 使用该组件需要以下属性：
 * @param dataList: PropTypes.array.isRequired, 数据，元素格式为{id:'1',pId:'0',name:'test'}
 * @param idKey: PropTypes.string, id对应的key名称，默认为'id'
 * @param pIdKey: PropTypes.string, pId对应的key名称，默认为'pId'
 * @param nameKey: PropTypes.string, name对应的key名称，默认为'name'
 * @param checkable: PropTypes.bool, 不传则默认为false
 * @param searchable: PropTypes.bool, 不传则默认为false * @param expandedKeys: PropTypes.array, //默认展开的节点Id
 * @param checkedKeys: PropTypes.array, 当checkable为true时,默认勾选的节点Id
 * @param selectedKey: PropTypes.string, 当checkable为false时,默认选择的节点Id
 *
 * 方法：
 * @param onSelect: PropTypes.func, 当checkable为false时，需要传入该参数，当点击某个节点时会调用该方法，提供参数selectedKey（选择的节点id）
 * @param onCheck: PropTypes.func, 当checkable为true时，需要传入该参数，当勾选某个节点时会调用该方法，提供currentNode, checkedIds两个参数
 *      currentNode表示本次勾选或取消勾选操作的节点对象，checkedIds表示当前选中的所有节点的id列表
 */
class NTree extends Component {
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
                    <div className="whole_container">
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
                        <div className="row tree_container">
                            <ul id="tree" className="ztree"></ul>
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
                <div className="row tree_container">
                    <ul id="tree" className="ztree"></ul>
                </div>
            )
        }
        return result;
    }
}
NTree.propTypes = {
    dataList: PropTypes.array.isRequired,
    checkable: PropTypes.bool, //不传则默认为false
    searchable: PropTypes.bool, //不传则默认为false
    onSelect: PropTypes.func, //当checkable为false时，需要传入该参数，当点击某个节点时会调用该方法，提供参数selectedKey
    onCheck: PropTypes.func, //当checkable为true时，需要传入该参数，当勾选某个节点时会调用该方法，提供currentNode, checkedIds两个参数
    expandedKeys: PropTypes.array, //默认展开的节点Id
    checkedKeys: PropTypes.array, //当checkable为true时,默认勾选的节点Id
    selectedKey: PropTypes.string, //当checkable为false时,默认选择的节点Id
    idKey: PropTypes.string, //id对应的key名称，默认为'id'
    pIdKey: PropTypes.string, //pId对应的key名称，默认为'pId'
    nameKey: PropTypes.string, //name对应的key名称，默认为'name'
};

export default NTree;