import React,{Component,PropTypes} from 'react';
import './OperationTable.css';
import OperationForm from '../OperationForm/OperationForm';

/**
 * 单表
 * 使用该组件需要以下属性：
 * @param primaryKey: （必填）主键
 * @param insertData: （选填）新增方法
 * @param deleteData: （选填）删除方法
 * @param updateData: （选填）修改方法
 * @param readData: （选填）展示详情 默认 false
 * @param dataList: （必填）获取表格数据方法
 * @param columnParams: 数组对象，元素为一个对象，对象中有以下几个键值对
 *      key string
 *      label string 如果不传该参数，则label与key相同
 *      placeholder string 如果不传该参数，则placeholder与label相同
 *      editReadOnly boolean 默认为false
 *      createReadOnly boolean 默认为false，新增只读，如果该属性为true，则必须指定default属性
 *      default 新增数据时的初始值
 *      visible boolean 默认为true
 *      validator object 表单验证，格式为bootstrap validator中的fields中的键值对的值格式
 *      render func 复杂控件的渲染方法，提供一个参数，为一个对象，该对象有两个参数{initValue: string, disabled: boolean}
 *      column object bootstrap-table的column样式参数 不传则默认水平垂直居中
 *
 */
class OperationTable extends Component {
    constructor(props) {
        super(props);

        this.setState = ({
            columnParams : this.props.columnParams
        });
    }

    initColumns(){
        let columns = [];
        let columnParams = this.props.columnParams;
        for(let i in columnParams){
            let column = columnParams[i].column || [];

            column.field = columnParams[i].key;
            column.title = columnParams[i].lable;
            column.align = "center";
            column.valign = "middle";

            columns.push(column);
        }
        return columns;
    }

    //页面加载后刷新数据
    componentDidMount() {
        var dataList = this.props.dataList;
        var primaryKey = this.props.primaryKey;
        var pageSize = this.props.pageSize;
        var pageList = this.props.pageList;
        var columns = this.initColumns();

        $("#demo-table").bootstrapTable({
            data:dataList(),
            cache: false,
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            },
            formatNoMatches: function () {
                return '无符合条件的记录';
            },
            //striped: true,                              //是否显示行间隔色
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            height: $(window).height() - 110,
            pagination:true,
            clickToSelect: true,//点击选中行
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: pageSize || 10,                       //每页的记录行数（*）
            pageList: pageList || [10, 20, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: primaryKey || 'id',                     //每一行的唯一标识，一般为主键列
            columns: columns || []
        });

        this.hidingColumns();
    };

    //隐藏列
    hidingColumns(){
        var columnParams = this.props.columnParams;
        for(var i in columnParams){
            var column = columnParams[i];

            if(!!column.visible){
                $('#demo-table').bootstrapTable('hideColumn', column.key);
            }
        }
    }

    onInsertData = (values) => {
        let insertData = this.props.insertData;

        let result = insertData(values);

        let $table = $("#demo-table");

        if(result.state===1){
            var index = $table.bootstrapTable('getData').length;
            $table.bootstrapTable('insertRow', {
                index: 0,
                row: values
            });

            alert("新增"+result.message+"成功！");
        }else{
            alert("新增"+result.message+"失败！");
        }
    };

    //新增方法
    insertBtnClick = () => {
        let params = {
            operationType:'create',
            title:'新增',
            onSubmit : this.onInsertData,
            fields: this.props.columnParams
        }

        layer.open({
            type: 1,
            content: <OperationForm {...params}/>
        });

    };

    //点击删除按钮时触发
    deleteBtnClick = () => {
        let $table = $("#demo-table");
        let $delete = $('#del');
        let primaryKey = this.props.primaryKey;

        let ids = $.map($table.bootstrapTable('getSelections'), function (row) {
            return row[primaryKey];
        });
        if (ids.length < 1 ) {
            alert("请至少选择一条记录!");
            return;
        }
        let deleteData = this.props.deleteData;
        let result = deleteData();
        if(result.state===1){
            $table.bootstrapTable('remove', {
                field: primaryKey,
                values: ids
            });
            alert("删除"+result.message+"成功！");
        }else{
            alert("删除"+result.message+"失败！");
        }
    };

    onUpdateData = (values) => {
        let $table = $("#demo-table");
        let updateData = this.props.updateData;
        let result = updateData(values);

        if(result.state===1){
            $table.bootstrapTable('updateRow', {
                index : i,
                row:values
            });
            alert("修改"+result.message+"成功！");
        }else{
            alert("修改"+result.message+"失败！");
        }
    };

    updateBtnClick = () => {
        let $table = $("#demo-table");
        let $delete = $('#del');
        let primaryKey = this.props.primaryKey;

        let ids = $.map($table.bootstrapTable('getSelections'), function (row) {
            return row[primaryKey];
        });
        if (ids.length != 1 ) {
            alert("请选择一条记录!");
            return;
        }

        let i=0;
        let allTableData = $table.bootstrapTable('getData');
        for(;i<allTableData.length;i++){
            if(allTableData[i][primaryKey]===ids[0]){
                break;
            }
        }

        let params = {
            operationType:'edit',
            title:'修改',
            record:allTableData[i],
            onSubmit : this.onUpdateData,
            fields: this.props.columnParams
        }

        layer.open({
            type: 1,
            content: <OperationForm {...params}/>
        });
    };

    render() {
        let result;
        let btns = [];

        if (!!this.props.insertData) {
            btns.push(<button key="btn_add" id="btn_add" type="button" onClick={this.insertBtnClick} className="btn row btn-success glyphicon glyphicon-plus">
                <span aria-hidden="true"></span>新增
            </button>);
        };

        if (!!this.props.deleteData) {
            btns.push(<button key="btn_delete" id="btn_delete" type="button" onClick={this.deleteBtnClick} className="btn row btn-danger glyphicon glyphicon-remove">
                <span aria-hidden="true"></span>删除
            </button>);
        };

        if (!!this.props.updateData) {
            btns.push(<button key="btn_edit" id="btn_edit" type="button" onClick={this.updateBtnClick} className="btn row btn-error glyphicon glyphicon-pencil">
                <span aria-hidden="true"></span>修改
            </button>);
        };

        if (!!this.props.updateData) {
            btns.push(<button key="btn_edit" id="btn_read" type="button" onClick={this.readBtnClick} className="btn row btn-warning glyphicon glyphicon-pencil">
                <span aria-hidden="true"></span>查看
            </button>);
        };
        result = (
            <div>
                {btns}
                <table id="demo-table">
                </table>
            </div>
        )
        return result;
    }
}

// OperationTable.propTypes = {
//       dataList: PropTypes.array.isRequired,
// };

export default OperationTable;