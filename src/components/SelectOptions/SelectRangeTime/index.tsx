import React, { PureComponent } from "react";
import { DatePicker } from "antd";
import classnames from "classnames";
import style from "../index.css";
import moment from "moment";
import {
  SeachOptionsValue,
  SelectRangeTimeProps,
  SelectRangeState,
  RangePickerValue
} from "../../SeachOptions/interface";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

const SELECTS: SeachOptionsValue = {
  week: "近一周",
  month: "近一月",
  halfYear: "近半年"
};

export default class SelectRangeTime extends PureComponent<
  SelectRangeTimeProps,
  SelectRangeState
> {
  constructor(props: SelectRangeTimeProps) {
    super(props);
    this.state = {
      range: undefined,
      selectValue: []
    };
  }

  triggerChange = (range: string | undefined, time: Array<string>) => {
    const {
      onChange,
      content: { startTime, endTime }
    } = this.props;
    let value: string | object = "ALL";
    if (time[0] && time[1]) {
      value = {
        [startTime]: time[0] + " 00:00:00",
        [endTime]: time[1] + " 23:59:59"
      };
    }
    this.setState({ range });
    if (onChange) {
      onChange(value)();
    }
  };
  selectKey = (range: string | undefined) => (
    t1: RangePickerValue,
    t2: Array<string>
  ) => {
    const endTime = moment().format(dateFormat);
    const weekStart = moment()
      .subtract(1, "week")
      .format(dateFormat);
    const monthStart = moment()
      .subtract(1, "month")
      .format(dateFormat);
    const halfYearStart = moment()
      .subtract(6, "month")
      .format(dateFormat);
    let rangeTime: Array<string> = [];
    if (range === "week") {
      rangeTime = [weekStart, endTime];
    } else if (range === "month") {
      rangeTime = [monthStart, endTime];
    } else if (range === "halfYear") {
      rangeTime = [halfYearStart, endTime];
    } else if (range === "custom") {
      rangeTime = t2;
      this.setState({
        selectValue: t1
      });
    }
    this.triggerChange(range, rangeTime);
  };
  render() {
    const { range, selectValue } = this.state;
    const { value } = this.props;
    const selects = Object.keys(SELECTS).map(key => (
      <div
        key={key}
        className={classnames(style.optionsTag, {
          [style.tagSelected]: value !== "ALL" && range === key
        })}
      >
        <span
          className={style.pointer}
          onClick={e => this.selectKey(key)([], [])}
        >
          {SELECTS[key]}
        </span>
      </div>
    ));
    const pickerValue =
      value !== "ALL" && range === "custom" ? selectValue : [];
    return (
      <span>
        {selects}
        <RangePicker
          getCalendarContainer={node => node.parentNode}
          size="small"
          value={pickerValue}
          style={{ width: 200, marginTop: "-1px" }}
          onChange={this.selectKey("custom")}
          format={dateFormat}
        />
      </span>
    );
  }
}
