import React from 'react'
import * as MyReact from "../src/MyReact";
import { Todo } from '../demo'
import '@testing-library/jest-dom'
import { getByText } from '@testing-library/dom'

let container: any

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)

})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe('Todo 组件', () => {

  // 能够正确传递task属性
  describe('能够正确渲染待办项目名称', () => {
    it('should render task correctly', () => {
      MyReact.render(<Todo task='add testing' completed={false} />, container)
      expect(getByText(container, 'add testing')).toBeInTheDocument()
    })
  })

  describe('能够正确渲染样式', () => {
    // 能够正确渲染样式 completed: false 
    it('should render class correctly => completed: false', () => {
      MyReact.render(<Todo task='add testing' completed={false} />, container)
      expect(getByText(container, 'add testing')).toHaveClass('ongoing')
    })
    // 能够正确渲染样式 completed: true
    it('should render class correctly => completed: true', () => {
      MyReact.render(<Todo task='add testing' completed={true} />, container)
      expect(getByText(container, 'add testing')).toHaveClass('completed')
    })
    // 能够正确渲染样式 completed: not given
    it('should render class correctly => completed: not given', () => {
      MyReact.render(<Todo task='add testing' />, container)
      expect(getByText(container, 'add testing')).toHaveClass('ongoing')
    })
  })

  describe('能够正确触发点击事件', () => {
    it('should trigger click event correctly', () => {
      // 创建一个mock方法
      const clickSpy = jest.fn()

      // 点击事件即为mock方法
      MyReact.render(<Todo task='add testing' event={clickSpy} />, container)

      // 触发点击事件
      const todo = getByText(container, 'add testing')
      todo.click()

      expect(clickSpy).toHaveBeenCalled()
    })
  })
})
