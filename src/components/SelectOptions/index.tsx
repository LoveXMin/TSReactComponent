import React from "react";
import { Menu, Dropdown } from "antd";
import SelectRangeTime from "./SelectRangeTime";
import classnames from "classnames";
import style from "./index.css";
import { SelectOptionsProps, DropdownsProps } from "../SeachOptions/interface";

const SelectOptions = (props: SelectOptionsProps) => {
  const {
    options: { label, key, content, hasAll = false, type = "" },
    value = {},
    onChange
  } = props;
  const _V = value[key] || "ALL";
  const _content = typeof content === "function" ? content({}) : content;
  const _onChange = (e: string | object) => (_: any) => {
    if (onChange) {
      onChange(key)(e);
    }
  };
  let selects: JSX.Element | Array<JSX.Element> = [];
  if (type === "dropdown") {
    selects = (
      <Dropdowns content={_content} value={value} onChange={onChange} />
    );
  } else if (type === "rangeTime") {
    selects = (
      <SelectRangeTime content={_content} value={_V} onChange={_onChange} />
    );
  } else {
    selects = Object.keys(_content).map(key => (
      <div
        key={key}
        className={classnames(style.optionsTag, {
          [style.tagSelected]: _V === key
        })}
      >
        <span className={style.pointer} onClick={_onChange(key)}>
          {_content[key]}
        </span>
      </div>
    ));
  }
  return (
    <div className={style.optionsWarp}>
      <div className={style.optionsLable}>{label}：</div>
      <div className={style.optionsList}>
        {hasAll && (
          <div
            className={classnames(style.optionsTag, {
              [style.tagSelected]: _V === "ALL"
            })}
          >
            <span className={style.pointer} onClick={_onChange("ALL")}>
              全部
            </span>
          </div>
        )}
        {selects}
      </div>
    </div>
  );
};

const Dropdowns = ({ content, value, onChange }: DropdownsProps) => {
  const dropdowns = content.map((val, i) => {
    const { label, key, content, hasAll = false } = val;
    const _V = value[key] || "ALL";
    const _content = typeof content === "function" ? content() : content;
    const menu = Object.keys(_content).map((val, i) => (
      <Menu.Item
        key={val}
        onClick={() => {
          onChange(key)(val);
        }}
      >
        <span className={style.dropItem} title={_content[val]}>
          {_content[val]}
        </span>
      </Menu.Item>
    ));
    if (hasAll) {
      menu.unshift(
        <Menu.Item
          key="ALL"
          onClick={() => {
            onChange(key)("ALL");
          }}
        >
          <span className={style.dropItem} title="全部">
            全部
          </span>
        </Menu.Item>
      );
    }
    return (
      <div className={style.dropdownWarp} key={key}>
        <Dropdown
          placement="bottomCenter"
          getPopupContainer={node => node.parentNode}
          overlay={<Menu selectedKeys={[_V]}>{menu}</Menu>}
        >
          <span className={style.dropText}>{label}</span>
        </Dropdown>
      </div>
    );
  });
  return <span>{dropdowns}</span>;
};

export default SelectOptions;
