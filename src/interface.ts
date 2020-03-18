//XSelect props的接口定义
export interface XSIProps<T = IValue> {
  onChange: (value: T) => void;
  selectArr: T;
  defaultValue?: T;
  xvalue: T;
  value?: string | string[] | number | number[] | undefined;
  [propsValue: string]: any;
}
//Select state的接口定义
export interface IState {
  value: IValue;
}
export declare type IValue = Array<Value>;
export declare type Value = {
  value: string;
  id: string;
};
