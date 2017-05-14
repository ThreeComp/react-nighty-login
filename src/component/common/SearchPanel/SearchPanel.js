/**
 * Created by chenchao on 17/5/10.
 */

import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import styles from './SearchPanel.css';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 该组件用于表格的搜索，使用该组件需要两个属性
 * 1.onSearch 该属性值为一个方法(点击确定按钮时调用)
 *    该方法应该接受一个名为values的参数，values为搜索表单中各个字段的值，格式为：{name:"aa", age:undefined}
 * 2.searchParams
 *    该参数为一个对象，该对象内部应包含以下几个属性：
 *    keys: ['name', 'age', {key: 'sex', transform: {"1": "男", "2": "女"}}],必填参数
 *    labels: ['Name', 'Age', 'Sex'],必填参数
 *    placeholders: ['姓名','Age','Sex'],可选参数
 *    当搜索对象为一个下拉列表时，往往需要字典转换，此时的keys属性值应该为一个对象，包含两个属性：key和transform，如上面的
 *    {key: 'sex', transform: {"1": "男", "2": "女"}}，表示值为"1"显示"男"，值为"2"显示"女"
 */
class SearchPanel extends React.Component {
    state = {
        expand: false,
    };

    handleSearch = (e) => {
        e.preventDefault();
        const { onSearch } = this.props;
        this.props.form.validateFields((err, values) => {
            onSearch(values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        const { onSearch } = this.props;
        this.props.form.validateFields((err, values) => {
            onSearch(values);
        });
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const {keys, labels, placeholders} = this.props.searchParams;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        const children = [];
        for (let i = 0; i < keys.length; i++) {
            if (typeof (keys[i]) == "object"){
                const key = keys[i].key;
                let trans = keys[i].transform;
                let options = [];
                for (let transKey in trans){
                    options.push(<Option value={transKey} key={transKey}>{trans[transKey]}</Option>);
                }
                children.push(
                    <Col span={8} key={key}>
                        <FormItem {...formItemLayout} label={labels[i]}>
                            {getFieldDecorator(key)(
                                <Select placeholder={placeholders ? placeholders[i] : labels[i]}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                );
            }
            else {
                const key = keys[i];
                children.push(
                    <Col span={8} key={key}>
                        <FormItem {...formItemLayout} label={labels[i]}>
                            {getFieldDecorator(key)(
                                <Input placeholder={placeholders ? placeholders[i] : labels[i]} />
                            )}
                        </FormItem>
                    </Col>
                );
            }
        }

        const expand = this.state.expand;
        const shownCount = expand ? children.length : 6;

        return (
            <Form
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>
                    {children.slice(0, shownCount)}
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            Clear
                        </Button>
                        {
                            children.length > 6 &&
                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                                Collapse <Icon type={expand ? 'up' : 'down'} />
                            </a>
                        }
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(SearchPanel);
