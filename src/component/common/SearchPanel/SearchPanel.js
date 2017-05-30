/**
 * Created by chenchao on 17/5/10.
 */

import React, {Component,PropTypes} from 'react';
import './SearchPanel.css';

/**
 * 该组件用于表格的搜索，使用该组件需要两个属性
 * @param fields: 数组对象，元素为一个对象，对象中有以下几个键值对
 *      key string
 *      label string 如果不传该参数，则label与key相同
 *      placeholder string 如果不传该参数，则placeholder与label相同
 *      render func 复杂控件的渲染方法
 * @param onSearch func 点击搜索按钮时调用的方法，该方法应该接受一个名为values的参数，values为Item各个字段的值，格式为：{name:"aa", age:undefined}
 */
class SearchPanel extends Component {
    state = {
    };

    getValues = () => {
        let fieldValues = {};
        let {fields} = this.props;
        for (let field of fields) {
            let key = field.key;
            let value = $("#" + key).val();
            fieldValues[key] = value;
        }
        return fieldValues;
    };

    handleSearch = () => {
        const onSearch = this.props.onSearch || function () {
            };
        let values = this.getValues();
        onSearch(values);
    };

    handleReset = () => {
        let {fields} = this.props;
        for (let field of fields) {
            let key = field.key;
            let value = $("#" + key).val("");
        }
        this.handleSearch();
    };

    render() {
        let that = this;
        const {fields} = this.props;
        const layout = {
            label: 3,
            input: 9
        };
        let labelClassName = "col-md-" + layout.label + " control-label";
        let inputClassName = "col-md-" + layout.input;
        const formItems = [];
        for (let i = 0; i < fields.length; i++) {
            const _key = fields[i].key;
            const _label = fields[i].label || _key;
            const _placeholder = fields[i].placeholder || _label;
            const _render = fields[i].render;

            let labelClassName = "col-md-" + layout.label + " control-label";
            let inputClassName = "col-md-" + layout.input;

            //自定义渲染
            if (!!_render) {
                formItems.push(
                    <div className="form-item col-md-4" key={_key}>
                        <div className="form-group">
                            <label className={labelClassName}>{_label}</label>
                            <div className={inputClassName}>
                                {
                                    _render()
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            //普通文本框
            else {
                formItems.push(
                    <div className="form-item col-md-4" key={_key} >
                        <div className="form-group">
                            <label className={labelClassName}>{_label}</label>
                            <div className={inputClassName}>
                                <input type="text" id={_key} name={_key} className="form-control"
                                       placeholder={_placeholder}/>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        $(function () {
            $("#okBtn").click(function () {
                that.handleSearch();
            });
            $("#cancelBtn").click(function () {
                that.handleReset();
            });
        });

        return (
            <div className="container">
                <form onSubmit={this.handleSearch}>
                    <div className="row item-box" >
                        {formItems}
                    </div>
                </form>
                <button id="cancelBtn" className="col-md-1 btn btn-primary pull-right">清空</button>
                <button id="okBtn" className="col-md-1 btn btn-primary pull-right" style={{marginRight: 20}}>
                    搜索
                </button>
            </div>

        );
    }
}
SearchPanel.propTypes = {
    fields: PropTypes.array.isRequired,
    onSearch: PropTypes.func,
};

export default SearchPanel;
