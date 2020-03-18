import * as React from "react";
import { render } from "react-dom";
import { Select } from "antd";
import { XSIProps, IState, IValue } from "./interface";
import "antd/dist/antd.css";
import "./styles.css";
import { SelectProps } from "antd/lib/select";
const { Option } = Select;
const children = [];
const selectArr = [
  {
    value: "a",
    id: "1"
  },
  {
    value: "b",
    id: "2"
  },
  {
    value: "c",
    id: "3"
  },
  {
    value: "d",
    id: "4"
  }
];

selectArr.forEach(val => {
  children.push(<Option key={val.id}>{val.value}</Option>);
});

class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      value: []
    };
  }
  handleChange = (value: IValue) => {
    console.log(`selected :`, value);
    this.setState({
      value
    });
  };
  render() {
    const { value } = this.state;
    return (
      <div className="App">
        <XSelext
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Please select"
          xvalue={value}
          onChange={this.handleChange}
          selectArr={selectArr}
        />
      </div>
    );
  }
}

const XSelext = (props: XSIProps) => {
  const { onChange, selectArr, defaultValue = [], xvalue } = props;
  const _handleChange = (value: any) => {
    const selectObj = selectArr.filter(val => value.indexOf(val.id) > -1);
    onChange(selectObj);
  };
  const getValue = (_value: IValue) => _value.map(val => val.id);
  const children = selectArr.map(val => (
    <Option key={val.id}>{val.value}</Option>
  ));
  const _props: SelectProps = {
    ...props,
    onChange: _handleChange,
    defaultValue: getValue(defaultValue)
  };
  if (xvalue) {
    _props.value = getValue(xvalue);
    console.log(_props.value);
  }
  return <Select {..._props}>{children}</Select>;
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
