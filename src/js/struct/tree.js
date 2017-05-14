/**
 * Created by chenchao on 17/5/11.
 */

(function(window, undefined){
    /**
     * 数据结构——树
     * 通过var tree = Tree.generateTree静态方法生成一棵树
     * 提供了一下几个树操作：
     * insertNode (node)
     * deleteNode (node)
     * deleteNodeById (id)
     * getNodeById (id)
     * print ()
     * toCustomTree (idMapped, nameMapped, childrenMapped, necessary) //将树转变为特定格式的对象
     * @constructor
     */
    var Tree = function() {
        var innerMap; //内部维护一个map，key为Node的id，value为Node
        this.getRootNode = function () {
            return this.RootNode;
        };
        this.setRootNode = function (rootNode) {
            this.RootNode = rootNode;
        };
        this.getInnerMap = function () {
            return innerMap;
        };
        this.setInnerMap = function (map) {
            innerMap = map;
        };
        this.insertNode = function (node) {
            this.getInnerMap().set(node.id + "", node);
            node.parent.children.push(node);
        };
        this.deleteNode = function (node) {
            var children = node.parent.children;
            for (var i = 0; i < children.length; i++){
                if (children[i].id == node.id){
                    children[i] = null;
                    children.splice(i,1); //删除节点
                    break;
                }
            }
        };
        this.deleteNodeById = function (id) {
            var node = this.getNodeById(id);
            this.deleteNode(node);
        };
        this.getNodeById = function (id) {
            var map = this.getInnerMap();
            return map.get(id);
        };
        var printNode = function (node, level) {
            var gap = "";
            for (var i = 0; i < level; i++){
                gap += "  ";
            }
            console.log(gap + node.name);
            for(var i = 0; i < node.children.length; i++){
                printNode(node.children[i], level + 1);
            }
        };
        this.print = function () {
            printNode(this.getRootNode(),0);
        };
        /**
         * 有时候需要如下树对象的id可能叫key，name也肯能叫其他名字，往往要求的格式如下：
         *  {key:null, title:\'RootNode\', children:[
	     *      {key:\'001\', title:\'001\'},
	     *      {key:\'002\', title:\'002\',children:[
	     *          {key:\'003\', title:\'003\'},
	     *      ]},
	     *  ]}
         * 该方法就是将树转变为要求的格式
         * @param idMapped id的映射名称
         * @param nameMapped name的映射名称
         * @param childrenMapped children的映射名称
         * @param necessary 当children为[]时，是否需要该属性，为true时表示需要，false表示不需要
         */
        this.toCustomTree = function (idMapped, nameMapped, childrenMapped, necessary) {
            var customTree = {};
            var rootNode = this.getRootNode();
            nodeToObj(idMapped, nameMapped, childrenMapped, necessary, rootNode, customTree);
            return customTree;
        };
        var nodeToObj = function (idMapped, nameMapped, childrenMapped, necessary, node, obj) {
            obj[idMapped] = node.id;
            obj[nameMapped] = node.name;
            if (necessary) obj[childrenMapped] = [];
            for (var i = 0; i < node.children.length; i++){
                var subObj = {};
                nodeToObj(idMapped, nameMapped, childrenMapped, necessary, node.children[i], subObj);
                obj[childrenMapped] = obj[childrenMapped] || [];
                obj[childrenMapped].push(subObj);
            }
        };
    };
    /**
     * 生成Tree
     * @param dataList array
     *      dataList中元素的格式为：
     *      {id:string, name:string, parentId:string}
     *      parentId为选填字段（没有该字段表示为顶层节点），id和name为必填字段
     *      如果是顶层节点，格式为{id:string, name:string}或{id:string, name:string, parentId:null}
     *      推荐父节点在子节点之前，否则显示顺序可能会改变
     */
    Tree.generateTree = function (dataList) {
        if (dataList == undefined) {
            throw new Error('dataList can not be undefined.');
        }
        var tree = new Tree();
        var rootNode = new Node();
        rootNode.name = 'RootNode';
        var childrenOfRootNode = [];
        rootNode.children = childrenOfRootNode;
        var map = new Map();
        var tempList = [];
        for (var i = 0; i < dataList.length; i++){
            tempList.push(dataList[i]);
        }
        var oldLength = tempList.length;
        while (tempList.length > 0){
            for (var i = 0; i < tempList.length; i++) {
                var item = tempList[i];
                var node = new Node(item.id,item.name);
                if(!item.parentId){
                    node.parent = rootNode;
                    childrenOfRootNode.push(node);
                    map.set(item.id, node);
                    tempList.splice(i--,1); //从列表中删除该元素
                }
                else {
                    var parent = map.get(item.parentId);
                    if (parent) {
                        node.parent = parent;
                        parent.children.push(node);
                        map.set(item.id, node);
                        tempList.splice(i--,1); //从列表中删除该元素
                    }
                    else {
                        continue;
                    }
                }
            }
            // 防止数据错误造成的死循环
            if (oldLength != tempList.length)
                oldLength = tempList.length;
            else {
                console.warn("dataList父子节点关系有问题.")
                break;
            }
        }
        tree.setRootNode(rootNode);
        tree.setInnerMap(map);
        return tree;
    };
    /**
     * 树的节点的数据结构
     * @param id
     * @param name
     * @param parent
     * @param children 叶节点的children为[]
     * @constructor
     */
    var Node = function(id, name, parent, children) {
        this.id = id;
        this.name = name;
        this.parent = parent;
        this.children = children || []; //叶节点的children为[]
    };

    window.Tree = Tree;
    window.Node = Node;

})(window);
