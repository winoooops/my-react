import * as TinyReact from '../TinyReact/index'
import * as React from 'react'
// import { TinyComponent } from '../TinyReact/types';
import { Todo } from "./Todo";

// 应用TinyReact会报错: Type 'Todos' is missing the following properties from type 'ElementClass': context, setState, forceUpdate, state, refs
// console.log(TinyReact.Component) 
export class Todos extends React.Component {
  constructor(props: any) {
    super(props)
  }
  render() {
    console.log(TinyReact)
    return (
      <div>
        <Todo taskName="createElement" />
        <Todo taskName="render" />
        <Todo taskName="component rendering" />
      </div >
    )
  }

}