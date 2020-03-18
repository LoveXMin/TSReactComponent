import React, { PureComponent } from "react";
import { Tag } from "antd";
import SelectOptions from "../SelectOptions";
import {
  SeachOptionsProps,
  SeachOptionsState,
  SeachOptionsValue,
  SeachOptionsOptions
} from "./interface";
import style from "./index.css";
/**
 * props接受参数 seachOptions onSearch defaultValue
 * seachOptions  筛选的配置项目(必填项否则没有意义)
 * 每一项配置中的参数
 * label (必选)  筛选条件左侧的类目
 * key  (必选)  筛选条件用于搜索的字段,type==='rangeTime'时为必选携带'TIMES'开头
 * hasAll (非必选) 筛选条件是否有全选项
 * type (非必选)  筛选条件的类型 主要是区分其他选择的下拉选择(dropdown)和时间段选择(rangeTime)
 * content 作为普通筛选时为object类型 以键值对表示当前选择项的选择值及展示值  eg:{'1': '已上线'}
 *         作为type==='dropdown'时为数组类型 接收每一项下拉项的options   eg: [{ label: '上线状态', key: 'shopStatus', content: {'1': '已上线',	'2': '未上线'}
 *         作为type==='rangeTime'时为对象类型 接收开始时间的字段和结束时间的字段  eg:{startTime: 'startSettleTime', endTime: 'endSettleTime'}
 * onSearch 参数是个object,能拿到当前所有选择的值
 */

export default class SeachOptions extends PureComponent<
  SeachOptionsProps,
  SeachOptionsState
> {
  constructor(props: SeachOptionsProps) {
    super(props);
    this.state = {
      value: props.defaultValue || {},
      collapseOpen: true
    };
  }

  onChange = (key: string) => (e: any) => {
    const { value } = this.state;
    const __value = { ...value };
    const { beforeSearch } = this.props;
    if (e === "ALL") {
      delete value[key];
    } else {
      value[key] = e;
    }
    if (JSON.stringify(__value) === JSON.stringify(value)) return;
    let _value = { ...value };
    if (beforeSearch) {
      _value = beforeSearch(key, value);
    }
    this.triggerChange(_value);
  };

  triggerChange = (value: SeachOptionsValue) => {
    const onSearch = this.props.onSearch;
    this.setState({ value });
    let _value = { ...value };
    const timesKey = Object.keys(value).filter(
      val => val.indexOf("TIMES") > -1
    );
    if (timesKey.length) {
      //有时间段筛选
      timesKey.forEach(val => {
        _value = { ..._value, ...value[val] };
        delete _value[val];
      });
    }
    if (onSearch) {
      onSearch(_value);
    }
  };

  handleClose = (tag: string) => {
    this.setState(({ value }) => {
      delete value[tag];
      this.triggerChange(value);
      return value;
    });
  };

  handleClear = (_: any) => {
    const noClearObj: SeachOptionsOptions = this.props.seachOptions.filter(
      v => v.noClear
    )[0];
    let obj: SeachOptionsValue = {};
    if (noClearObj) {
      const { value } = this.state;
      if (value[noClearObj.key]) obj[noClearObj.key] = value[noClearObj.key];
    }
    this.setState({ value: obj });
    this.triggerChange(obj);
  };

  getTagChild = (value: SeachOptionsValue) => {
    const { seachOptions } = this.props;
    const tags: Array<JSX.Element> = [];
    const timesKey = seachOptions.filter(val => val.key.indexOf("TIMES") > -1);
    Object.keys(value).forEach(val => {
      const tagValue = value[val];
      if (tagValue === "ALL") return;
      let obj = seachOptions.filter(v => v.key === val)[0];
      if (!obj) {
        const obj1 = seachOptions.filter(v => v.type === "dropdown")[0];
        if (obj1) {
          const obj1Content =
            typeof obj1.content === "function" ? obj1.content() : obj1.content;
          obj = obj1Content.filter((v: { key: string }) => v.key === val)[0];
        }
      }
      if (!obj) return;
      const objContent =
        typeof obj.content === "function" ? obj.content() : obj.content;
      let tagName = objContent[tagValue];
      if (obj.type === "rangeTime") {
        const { startTime, endTime } = objContent;
        tagName =
          tagValue[startTime].split(" ")[0] +
          "-" +
          tagValue[endTime].split(" ")[0];
        if (timesKey.length > 1) tagName = `${obj.label}: ${tagName}`;
      }
      const tagElem = (
        <Tag
          closable={!obj.noClear}
          onClose={(e: { preventDefault: () => void }) => {
            e.preventDefault();
            this.handleClose(val);
          }}
        >
          {tagName}
        </Tag>
      );
      const _tag = (
        <span key={val} className={style.selectedTags}>
          {" "}
          {tagElem}{" "}
        </span>
      );
      tags.push(_tag);
    });
    return tags;
  };
  setCollapse = (_: any) => {
    this.setState(({ collapseOpen }) => ({ collapseOpen: !collapseOpen }));
  };
  render() {
    const { value, collapseOpen } = this.state;
    const tagChild = this.getTagChild(value);
    return (
      <div className={style.seachOptions}>
        <div className={style.seachSelected}>
          <div className={style.selectedLable}>已选条件：</div>
          <div className={style.selectedList}>
            {tagChild}
            {tagChild.length > 0 ? (
              <span className={style.selectedClear} onClick={this.handleClear}>
                清除全部
              </span>
            ) : (
              <span className={style.noSelected}>暂无选择条件</span>
            )}
          </div>
          {!collapseOpen && (
            <div className={style.collapseBtn} onClick={this.setCollapse}>
              展开选项
            </div>
          )}
        </div>
        {collapseOpen && (
          <div className={style.selectOptions}>
            {this.props.seachOptions.map((val, i) => (
              <SelectOptions
                key={i}
                value={value}
                options={val}
                onChange={this.onChange}
              />
            ))}
            <div className={style.collapseClose} onClick={this.setCollapse}>
              收起选项
            </div>
          </div>
        )}
      </div>
    );
  }
}
