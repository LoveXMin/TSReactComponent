import moment from "moment";
export interface SeachOptionsProps {
  defaultValue?: object;
  beforeSearch?: (key: string, value: object) => object;
  seachOptions: Array<SeachOptionsOptions>;
  onSearch: (object: object) => void;
}
export interface SeachOptionsOptions {
  label: string;
  hasAll?: boolean;
  key: string;
  type?: string;
  noClear?: boolean;
  content: SeachOptionsValue | Array<SeachOptionsOptions>;
}

export interface SeachOptionsValue {
  [propName: string]: any;
}
export interface SeachOptionsState {
  value: SeachOptionsValue;
  collapseOpen: boolean;
  [propName: string]: any;
}
export interface SelectOptionsProps {
  options: SeachOptionsOptions;
  value: SeachOptionsValue;
  onChange: any;
}

export interface DropdownsProps {
  content: SeachOptionsOptions[];
  value: SeachOptionsValue;
  onChange: any;
}
export interface SelectRangeTimeProps {
  value: string | SeachOptionsValue;
  onChange: (value: string | object) => any;
  content: SelectRangeTimeContent;
}
export interface SelectRangeState {
  range: string | undefined;
  selectValue: RangePickerValue;
}
export interface SelectRangeTimeContent {
  startTime: string;
  endTime: string;
}
export declare type RangePickerValue =
  | undefined[]
  | null[]
  | [moment.Moment]
  | [undefined, moment.Moment]
  | [moment.Moment, undefined]
  | [null, moment.Moment]
  | [moment.Moment, null]
  | [moment.Moment, moment.Moment];
