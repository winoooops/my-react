import React from 'react'
import * as MyReact from "../src/MyReact";
import { Todos, Todo } from '../demo'
import '@testing-library/jest-dom'
import { getByText, getByRole } from '@testing-library/dom'


let container: any

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe('Todos组件', () => {
  describe('能够正确显示中文和英文列表', () => {
    it('should diplay English list', () => {
      MyReact.render(<Todos type="one" />, container)
      expect(getByRole(container, 'list')).toHaveClass('eng')
    })
    it('should diplay Chinese list', () => {
      MyReact.render(<Todos type="two" />, container)
      expect(getByRole(container, 'list')).toHaveClass('chi')
    })
  })

  describe('能够渲染多个Todo组件', () => {
    it('Eng list should have 3 todos', () => {
      MyReact.render(<Todos type="one" />, container)
      expect(getByRole(container, 'list').childElementCount).toBe(3)
    })

    it('Chinese List should have 6 todos', () => {
      MyReact.render(<Todos type="two" />, container)
      expect(getByRole(container, 'list').childElementCount).toBe(6)
    })
  })
})