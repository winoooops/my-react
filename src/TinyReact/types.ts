export type VirtualDOM = {
  type: any;
  props: any;
  childElements?: any[]
}


export class TinyComponent {
  props?: any;
  refs?: any;
  state?: any;
  context?: any;
  isTinyReactComponent?: {};
  setState?: <T>(partialState: T, cb: Function) => {}
  constructor(props?: any, refs?: any) {
    this.props = props
    this.refs = refs
  }
}

