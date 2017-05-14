import React, {Component,PropTypes} from 'react';
import {Modal, Form, Input, Select, Checkbox } from 'antd';
import OperationForm from '../OperationForm/OperationForm';

const FormItem = Form.Item;
const Option = Select.Option;

const OperationType = {
    READ: "read",
    CREATE: "create",
    EDIT: "edit",
};

/**
 * 该组件用于弹出操作弹框（编辑、查看、新增）
 * 使用该组件需要以下属性：
 * @param primaryKey: 数据源主键
 * @param operationType: 表示操作面板类型，该值为一个字符串，只能是"edit"、"create"、"read"中的一个
 * @param title: 标题
 * @param record: 该属性为一个对象，存放一个Item的key与value，如：{name:"aa",age:12}，编辑和查看需要传这个属性，新增不需要
 * @param dataModel:
 *    该参数为一个对象，该对象内部应包含以下几个属性：
 *    keys: ['name', 'age', 'sex']  必填参数
 *    labels: ['Name', 'Age', 'Sex']  可选参数，如果没有该参数，则label与key相同
 *    placeholders: ['姓名','Age','Sex']  可选参数，如果没有该参数，则placeholder与label相同
 *    dataOption: [...]  可选参数，目前只支持select框和checkbox的字典转换
 *        select的格式为{ key: 'sex', transform: {"1": "男", "2": "女"} }
 *        checkbox的格式为{key: 'visible',transform: {"0" : false, "1" : true}, toCheckbox: true},
 *        如果是其他复杂表单元素，则需要在父组件中做相关处理，并且需要设置dataOption，格式为：
 *            {key: 'icon', render: (value) => ( <Menu initValue={value} disabled={true}/> )}
 * @param onOk(values): 点击确定按钮时调用的方法，values为Item各个字段的值，格式为：{name:"aa", age:undefined}
 */
class OperationModal extends Component {
    values = {};
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            record: this.props.record || {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const {record} = nextProps;
        this.setState({ record });
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.props.form.resetFields();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = () => {
        const {onOk, dataModel:{dataOption = []}} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //将checkbox的值转换为原来的值，如false转换为0，转换法则在transform中，如：{"0" : false, "1" : true}
                for (let item of dataOption){
                    if (item.toCheckbox && item.transform){
                        let trans = item.transform;
                        let key = item.key;
                        let value = values[key];
                        for (let k in trans){
                            if (trans[k] == value){
                                values[key] = k;
                            }
                        }
                    }
                }

                onOk(values); //复杂表单元素需要在外层做相关处理
                this.hideModelHandler();
            }
        });
    };

    render() {
        const {children} = this.props;
        const {getFieldDecorator} = this.props.form;
        const record = this.state.record || {};
        let { operationType } = this.props;

        const params = {
            ...this.props,
            visible: this.state.visible,
            onOk: this.okHandler,
            onCancel: this.hideModelHandler,
            maskClosable: false
        };
        if (operationType == OperationType.READ){
            params.footer = null;
        }

        const formParams = {
            ...this.props,
            needButton: false,
            // onChange: (values) => {
            //   this.values = values;
            // }
        };

        return (
            <span>
      <span onClick={this.showModelHandler}>
        { children }
      </span>
        <Modal {...params}>
          <OperationForm {...formParams}/>
        </Modal>
    </span>
        );
    }
}

OperationModal.propTypes = {
    operationType: PropTypes.string.isRequired,
    title: PropTypes.string,
    record: PropTypes.object,
    dataModel: PropTypes.object.isRequired,
    onOk: PropTypes.func,
};

export default Form.create()(OperationModal);
