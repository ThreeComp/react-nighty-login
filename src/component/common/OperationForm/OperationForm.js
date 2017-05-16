/**
 * Created by chenchao on 17/5/11.
 */

import React, {Component,PropTypes} from 'react';
import {Form, Input, Select, Row, Col, Button, Checkbox} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const OperationType = {
    READ: "read",
    CREATE: "create",
    EDIT: "edit",
};

/**
 * 新增、编辑、查看面板
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
 * @param onSubmit(values): 点击确定按钮时调用的方法，values为Item各个字段的值，格式为：{name:"aa", age:undefined}
 */
class OperationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getValues = () => {
        let fieldValues;
        const {onSubmit, dataModel:{dataOption = []}} = this.props;
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
                fieldValues = values;
            }
        });
        return fieldValues;
    };

    handleSubmit = () => {
        const values = this.getValues();
        onSubmit(values);
    };
    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let {primaryKey, operationType, title, record, dataModel:{keys, labels, placeholders, dataOption = []}, needButton = true} = this.props;
        labels = labels || keys;
        placeholders = placeholders || labels;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };

        //以下部分到return之前都与OperationModal中一样，除了subRender != null 部分
        let formItems = [];
        //生成FormItem
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const initValue = operationType == OperationType.CREATE || record[key] == undefined ? "" : record[key] + "";
            let disabled = operationType == OperationType.READ ? true : false;
            if (operationType == OperationType.EDIT && key == primaryKey) {
                disabled = true;
            }
            //select字典转换
            let subRender = null;
            let trans = null;
            let toCheckbox = false;
            for (let item of dataOption){
                if (key == item.key){
                    subRender = item.render;
                    trans = item.transform;
                    toCheckbox = item.toCheckbox || toCheckbox;
                    break;
                }
            }
            //自定义渲染
            if (subRender != null){
                let labelClassName = "ant-col-" + formItemLayout.labelCol.span + " ant-form-item-label";
                let wrapperClassName = "ant-col-" + formItemLayout.wrapperCol.span + " ant-form-item-control-wrapper";
                formItems.push(
                    <div className="ant-row ant-form-item" key={key}>
                        <div className={labelClassName}>
                            <label htmlFor={key} title={labels[i]}>{labels[i]}</label>
                        </div>
                        <div className={wrapperClassName}>
                            <div className="ant-form-item-control">
                                {
                                    subRender(initValue)
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            //下拉列表转换
            else if (trans != null && !toCheckbox) { // {"1": "男", "2": "女"};
                let options = [];
                for (let transKey in trans) {
                    options.push(<Option value={transKey} key={transKey}>{trans[transKey]}</Option>);
                }

                formItems.push(
                    <FormItem {...formItemLayout} label={labels[i]} key={key}>
                        {
                            getFieldDecorator(key, initValue ? {initialValue: initValue} : {})(
                                <Select
                                    disabled={disabled}
                                    placeholder={placeholders ? placeholders[i] : labels[i]}
                                >
                                    {options}
                                </Select>
                            )
                        }
                    </FormItem>
                )
            }
            //checkbox转换
            else if (toCheckbox){
                let value;
                //先把数据转换为bool型，比如值为0转换为false，值为1转换为true
                //如果需要转换，此时trans的值就为转换法则，如：{"0" : false, "1" : true}，如果不需要转换，即值本来就为bool型，此时trans的值是null
                value = record[key] || false; //默认为false
                if (trans != null){
                    value = trans[record[key]];
                }
                formItems.push(
                    <FormItem {...formItemLayout} label={labels[i]} key={key}>
                        {
                            getFieldDecorator(key, {
                                valuePropName: 'checked',
                                initialValue: value,
                            })(
                                <Checkbox disabled={disabled} />
                            )
                        }
                    </FormItem>
                )
            }
            //普通文本框
            else {
                formItems.push(
                    <FormItem {...formItemLayout} label={labels[i]} key={key}>
                        {
                            getFieldDecorator(key, {initialValue: initValue,})(
                                <Input
                                    disabled={disabled}
                                    placeholder={
                                        (() => {
                                            if (operationType != OperationType.CREATE) {
                                                return "";
                                            }
                                            return placeholders ? placeholders[i] : labels[i];
                                        })()
                                    }
                                />)
                        }
                    </FormItem>
                )
            }
        }

        return (
            <div>
                {
                    (title) &&
                    <h2>{title}</h2>
                }
                <Form onSubmit={this.handleSubmit}>
                    {formItems}
                    {
                        (needButton && (operationType == OperationType.EDIT || operationType == OperationType.CREATE)) &&
                        <Row>
                            <Col span={24} style={{textAlign: 'right'}}>
                                <Button type="primary" htmlType="submit">确定</Button>
                                <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                            </Col>
                        </Row>
                    }
                </Form>
            </div>
        );
    }
}
OperationForm.propTypes = {
    primaryKey: PropTypes.string.isRequired,
    operationType: PropTypes.string.isRequired,
    title: PropTypes.string,
    record: PropTypes.object,
    dataModel: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    needButton: PropTypes.bool,
};

export default Form.create()(OperationForm);
