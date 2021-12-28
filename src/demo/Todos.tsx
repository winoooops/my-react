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

  state = {
    todoList: [
      {
        name: 'createElement',
        isComplete: true
      },
      {
        name: 'render',
        isComplete: true,
      },
      {
        name: 'component rendering',
        isComplete: false,
      }
    ]
  }

  render() {
    // console.log(this)
    console.log(this.state)
    console.log(TinyReact)
    const todoList = this.state.todoList.map(task => (
      <Todo taskName={task.name} isComplete={task.isComplete} />
    ))
    return (
      <div>
        {todoList}
      </div >
    )
  }

}