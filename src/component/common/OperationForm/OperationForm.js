/**
 * Created by chenchao on 17/5/11.
 */

import React, {Component,PropTypes} from 'react';
import './OperationForm.css';

const OperationType = {
    READ: "read",
    CREATE: "create",
    EDIT: "edit",
};

/**
 * 新增、编辑、查看面板
 * 使用该组件需要以下属性：
 * @param operationType: 表示操作面板类型，该值为一个字符串，只能是"edit"、"create"、"read"中的一个
 * @param title: 标题
 * @param record: 该属性为一个对象，存放一个Item的key与value，如：{name:"aa",age:12}，编辑和查看需要传这个属性，新增不需要
 * @param fields: 数组对象，元素为一个对象，对象中有以下几个键值对
 *      key string
 *      label string 如果不传该参数，则label与key相同
 *      placeholder string 如果不传该参数，则placeholder与label相同
 *      editReadOnly boolean 默认为false
 *      createReadOnly boolean 默认为false，新增只读，如果该属性为true，则必须指定default属性
 *      default 新增数据时的初始值
 *      visible boolean 默认为true
 *      validator object 表单验证，格式为bootstrap validator中的fields中的键值对的值格式
 *      render func 复杂控件的渲染方法，提供一个参数，为一个对象，该对象有两个参数{initValue: string, disabled: boolean}
 * @param onSubmit(values): 点击确定按钮时调用的方法，values为Item各个字段的值，格式为：{name:"aa", age:undefined}
 *
 */
class OperationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getValues = () => {
        let fieldValues = {};
        let {fields} = this.props;
        for (let field of fields){
            let key = field.key;
            let value = $("#" + key).val();
            fieldValues[key] = value;
        }
        return fieldValues;
    };

    handleSubmit = () => {
        const values = this.getValues();
        let onSubmit = this.props.onSubmit || function () {};
        onSubmit(values);
    };

    render() {
        let that = this;
        let {operationType, title, record = {}, fields = [], needButton = true} = this.props;
        let validator = {};
        validator.message = 'This value is not valid';
        validator.feedbackIcons = {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        };
        validator.fields = {};
        const layout = {
            label: 2,
            input: 10
        };

        //以下部分到return之前都与OperationModal中一样，除了subRender != null 部分
        let formItems = [];
        let initValues = [];
        // 生成FormItem
        for (let i = 0; i < fields.length; i++) {
            const _key = fields[i].key;
            const _label = fields[i].label || _key;
            const _placeholder = fields[i].placeholder || _label;
            const _editReadOnly = fields[i].editReadOnly || false;
            const _createReadOnly = fields[i].createReadOnly || false; //新增只读，如果该属性为true，则必须指定default属性
            const _default = fields[i].default; //新增数据时的初始值
            let _visible = fields[i].visible;
            const _render = fields[i].render; //是一个函数，提供一个参数，为一个对象，该对象有两个参数{initValue: string, disabled: boolean}
            const _validator = fields[i].validator; //格式为bootstrap validator中的fields中的键值对的值格式

            if(_visible == undefined)
                _visible = true;

            if (!!_validator)
                validator.fields[_key] = _validator;

            let initValue = "";
            if (operationType != OperationType.CREATE && record[_key] != undefined)
                initValue = record[_key] + "";
            else if (operationType == OperationType.CREATE && _default != undefined)
                initValue = _default;
            initValues.push(initValue);

            let disabled = false;
            if (operationType == OperationType.READ || (operationType == OperationType.EDIT && _editReadOnly) || (operationType == OperationType.CREATE && _createReadOnly))
                disabled = true;

            let labelClassName = "col-md-" + layout.label + " control-label";
            let inputClassName = "col-md-" + layout.input;

            //自定义渲染
            if (!!_render){
                formItems.push(
                    <div className="form-group" key={_key}>
                        <label className={labelClassName}>{_label}</label>
                        <div className={inputClassName}>
                            {
                                _render({value: initValue,disabled,})
                            }
                            <div id={_key + "-validate-label"} className="validate-label"></div>
                        </div>
                    </div>
                )
            }
            //普通文本框
            else {
                if (_visible){
                    formItems.push(
                        <div className="form-group" key={_key}>
                            <label className={labelClassName}>{_label}</label>
                            <div className={inputClassName}>
                                <input type="text" id={_key} name={_key} disabled={disabled}
                                       className="form-control" placeholder={_placeholder}/>
                                <div id={_key + "-validate-label"} className="validate-label"></div>
                            </div>
                        </div>
                    )
                }
                else {
                    formItems.push(
                        <input type="hidden" id={_key} name={_key} />
                    )
                }
            }
        }

        $(function () {
            for (let i = 0; i < fields.length; i++) {
                $("#" + fields[i].key).val(initValues[i]);
            }
            $("#okBtn").click(function () {
                /*手动验证表单，当是普通按钮时。*/
                $('#defaultForm').data('bootstrapValidator').validate();
                if(!$('#defaultForm').data('bootstrapValidator').isValid()){
                    return ;
                }
                that.handleSubmit();
            });
            $("#cancelBtn").click(function () {

            });
            $('#defaultForm').bootstrapValidator(validator);
        });

        return (
            <div>
                {
                    (title) &&
                    <h2>{title}</h2>
                }
                <div className="container">
                    <form id="defaultForm" className="form-horizontal">
                        {
                            formItems
                        }
                    </form>
                    {
                        (!!needButton) &&
                        (
                            <div>
                                <button id="cancelBtn" className="col-md-1 btn btn-primary pull-right">取消</button>
                                <button id="okBtn" className="col-md-1 btn btn-primary pull-right" style={{marginRight:"20px"}}>确认</button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}
OperationForm.propTypes = {
    operationType: PropTypes.string.isRequired,
    title: PropTypes.string,
    record: PropTypes.object,
    fields : PropTypes.array.isRequired,
    validator : PropTypes.object,
    needButton: PropTypes.bool,
    onSubmit: PropTypes.func,
};

export default OperationForm;
