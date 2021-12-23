# 用TypeScript手摸手造一个React轮子

> 本篇文章是在阅读[小村儿](https://juejin.cn/user/1310273589219623/posts)大佬的react学习系列之后自己的实践和补充, 正好最近也想通过用Typescript造轮子的过程加深对TS和类型思想的理解, 毕竟React对TS的支持度还是很高的(点名批评Vue). 理解源码最好的方式可能就是自己造一个. 这里大部分是我对编码思路的一些整理, 希望也能对你有所帮助. 如果有哪里不对或者不准确的地方, 也希望你能够毫不吝啬地指出来🥺

## 目录
- [项目准备](项目准备)
- [Why VirtualDOM](#Why&nbsp;VirtualDOM)
- [VitualDOM in a Nutshell](#VitualDOM&nbsp;in&nbsp;a&nbsp;Nutshell)
- [1. createElement](1.&nbsp;createElement)
- [2. 渲染DOM元素](2.&nbsp;渲染DOM元素)

## 项目准备
* `tsconfig.json`: 基本就是`tsc --init` 生成的, 目前只需要确保`jsx`选项用的是“preserve”即可.
```json
{
    "compilerOptions": {
        "target": "es2016", 
        "jsx": "preserve", 
        "module": "commonjs",
        "esModuleInterop": true, 
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true
    }
}
```
* 文件结构
```
├─demo
└─src
|  ├─MyReact // 具体实现的代码放这里
|  └─shared // 一些辅助函数和TS类型
```
* 安装所需依赖:
    * React和TS: `yarn add react typescript`
    * Webpack相关: `yarn add -D webpack webpack-cli webpack-dev-server style-loader sass-loader node-sass css-loader clean-webpack-plugin html-webpack-plugin babel-plugin-react-transform babel-loader @babel/core @babel/preset-env @babel/preset-react`
    * TS代码提示: `yarn add -D @types/react @types/dom `
* `webpack.config.js`
    ```js
    const path = require("path")
    const HtmlWebpackPlugin = require("html-webpack-plugin")
    const { CleanWebpackPlugin } = require("clean-webpack-plugin")

    module.exports = {
      mode: 'development',
      entry: "./demo/index.tsx",
      output: {
        path: path.resolve("dist"),
        filename: "bundle.js",
        // devtoolModuleFilenameTemplate: '../[resource-path]'
      },
      // 需要解析的文件类型
      resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js'],
      },
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: ['babel-loader', 'ts-loader'],
          },
          {
            test: /\.scss?$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          }
        ]
      },
      plugins: [
        // 在构建之前将dist文件夹清理掉
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: ["./dist"]
        }),
        // 指定HTML模板, 插件会将构建好的js文件自动插入到HTML文件中
        new HtmlWebpackPlugin({
          template: "./demo/index.html"
        })
      ],
      devServer: {
        // 指定开发环境应用运行的根据目录
        // contentBase: "./dist",
        // 指定控制台输出的信息
        // stats: "errors-only",
        // 不启动压缩
        compress: false,
        host: "localhost",
        port: 5000,
        hot: true,
      }
    }


    ```
## Why VirtualDOM 
> 用脚本进行DOM操作的代价很昂贵.有个贴切的比喻，把DOM和JavaScript各自想象为一个岛屿，它们之间用收费桥梁连接，js每次访问DOM，都要途径这座桥，并交纳“过桥费”,访问DOM的次数越多，费用也就越高. 因此，推荐的做法是尽量减少过桥的次数，努力待在ECMAScript岛上. 现代浏览器使用JavaScript操作DOM是必不可少的，但是这个动作是非常消耗性能的，因为使用JavaScript操作DOM对象要比JavaScript操作普通对象要慢很多，页面如果频繁的DOM操作会造成页面卡顿，应用流畅度降低，造成非常不好的体验.

Virtual DOM其实本质上就是React用来描述DOM对象的JavaScript对象，使用Virtual DOM的最主要原因便是提升效率——通过精确的找出发生变化的DOM对象，从而在在最少程度上减少直接操作DOM的次数.
## VitualDOM in a Nutshell
用三句话总结虚拟DOM的本质便是：
1. 虚拟DOM是Object类型的对象
2. 虚拟DOM无需真实DOM的诸多属性
3. 虚拟DOM最终会被React转化为真实DOM

借助babel，我们可以很清楚的看到jsx是怎样被编译的[^注]

[^注]: 代码案例来源: (https://juejin.cn/post/6970715569758666782)

### Babel编译虚拟DOM
```jsx
// jsx代码
<div className="container">
  <h3>Hello React</h3>
  <p>React is great</p>
</div>

// babel 编译过后
React.createElement (
  "div",
  {
    className: "container"
  },
  React.createElement("h3", null, "Hello React"),
  React.createElement("p", null, "React is great")
)
```

### 虚拟DOM的基本结构
而此时,如果我们在console.log中打印出上面这段jsx代码, 可以看到对应虚拟DOM的基本结构
```
{
  type: "div",
  props: { className: "container" },
  children: [
    {
      type: "h3",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "Hello React"
          }
        }
      ]
    },
    {
      type: "p",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "React is great"
          }
        }
      ]
    }
  ]
}
```

## 1. createElement 
为了了解createElement实现的原理，我们需要自己写一个简单的createElement方法，首先在react项目中的`.babelrc`中指明自定义的方法


```json
// .babelrc
{
  "presets": [
    "@babel/preset-env",
    [
      "babel/preset-react",
      {
        "pragma": "MyReact.createElement"
      }
    ]
  ]
}
```

这样一来虚拟DOM都会通过MyReact.createElement这个方法被构造. 

为了让createElement返回的对象符合React虚拟DOM的数据结构，createElement需要参照上一节中[*虚拟DOM的基本结构*](虚拟DOM的基本结构)来构造这个函数的返回.
```typescript
/* MyReact/MyReactCreateElement.ts */

/**
 * 
 * @param type 元素类型
 * @param props 属性
 * @param children 子元素 
 * @returns 
 */
export const createElement = (type: any, props: any, ...children: any): MyReactElement => {
  // 对子元素进行处理
  const childElements = children.map((child: any) => {
    // 如果子元素为虚拟DOM对象，直接返回
    if (child instanceof Object) {
      return child
    }
    // 如果子元素为纯文本，将文本储存在props.textContent中返回
    else {
      return createElement('text', { textContent: child })
    }
  })
  // props 中必须保存children信息 
  props = Object.assign({}, props, { children: childElements })

  // 这两个属性后期会用到
  const key = props.key || null
  const ref = props.ref || null

  return {
    type,
    props,
    key,
    ref,
  }
}
```

这里还有几个以后会用到的类型 :

```ts
/* shared/MyReactTypes.ts */

import { createElement, createRef } from "react"

export interface MyReactElement {
  type: any,
  props: { [key: string]: any },
  key: any | null,
  ref?: MyRef<any>;
  component?: MyReactComponent;
}

export interface MyReactComponent {
  [key: string]: any;
}

export type MyHTMLElement = HTMLElement & { __virtualDOM: MyReactElement } | HTMLInputElement & { __virtualDOM: MyReactElement }

// createRef构造的对象
export interface MyRefObject<T> {
  readonly current: T | null;
}
// 函数式的ref
export type MyRefCallback<T> = (instace: T) => {}

// 现在可使用ref对象，ref回调和ref字符串的形式定义ref
export type MyRef<T> = MyRefObject<T> | MyRefCallback<T> | String | null  

```




## 2. 渲染DOM元素 
我们先用createElement来渲染几个DOM元素看看, 这里首先需要对DOM元素的类型进行判断——如果为文本类型，把文本放到`props.textContent`里面；如果是DOM元素，先用`document.createElement`创造元素，然后根据传进来的props键值对的key来分类型地添加DOM属性; 
> 在创建DOM元素的同时我们还需要保存下渲染出这个DOM元素的虚拟DOM，这是之后Diff算法实现重要的一步.

### 2.1 添加DOM元素
```ts
/**
 * 渲染原生DOM元素
 * @param virtualDOM 虚拟DOM
 * @param container 父容器 
 */
export const mountDOMElement = (virtualDOM: MyReactElement, container: HTMLElement | null) => {
  let newElement: any
  const { type, props } = virtualDOM

  // 为纯文本
  if (type === 'text') {
    newElement = document.createTextNode(props?.textContent)
  }
  // 为DOM元素
  else {
    // 创建元素
    newElement = document.createElement(type)
    // 更新属性
    attachProps(virtualDOM, newElement)
    // 递归渲染子元素
    props?.children.forEach((child: MyReactElement) => {
      mountElement(child, newElement)
    })
  }
  //* 创建DOM元素的时候记录下当前的虚拟DOM, 这个以后会用到
  newElement.__virtualDOM = virtualDOM
  // 创建完之后添加到父容器中
  container?.appendChild(newElement)
}
```

### 2.2 给DOM元素添加props属性

在添加props属性的时候，需要判断下面几个特殊情况

- 如果有事件属性，需要添加事件
- 如果有有value或者checked属性直接赋值（无法直接使用setAttribute生成）
- 如果有className属性，添加class样式
- 如果有ref属性，这个以后处理

除此之外的属性其他一律使用`Element.setAttribute()`方法添加
```ts

/**
 * 更新props属性
 * @param virtualDOM 
 * @param element 
 */
export const attachProps = (virtualDOM: MyReactElement, element: MyHTMLElement) => {
  // 获取props键值对
  const props: { [key: string]: any } = virtualDOM.props
  const keys = Object.keys(props)

  // 遍历属性
  keys && keys.forEach((propName: string) => {
    updateProp(propName, props[propName], element)
  })
}

/**
 * 更新单个属性
 * @param propName 
 * @param propValue 
 * @param element 
 * @returns 
 */
export const updateProp = (propName: string, propValue: any, element: MyHTMLElement) => {
  // 如果是children 跳过
  if (propName === 'children') return
  // 事件以‘on’开头
  if (propName.slice(0, 2) === 'on') {
    const eventName = propName.toLocaleLowerCase().slice(2)
    element.addEventListener(eventName, propValue)
  }
  // className 附加属性
  else if (propName === 'className') {
    element.setAttribute('class', propValue)
  }
  // ref 接受string或者回调函数
  else if (propName === 'ref') {
    //  
  }
  // value或者checked属性
  else if (propName === 'value') {
    // element.value
    (element as HTMLInputElement).value = propValue
  }
  else if (propName === 'checked') {
    (element as HTMLInputElement).checked = propValue
  }
  // 其他
  else {
    element.setAttribute(propName, propValue)
  }
}
```
### 2.3 实现渲染: `MyReact.render()`
我们知道在React中render函数都是以`ReactDOM.render(<App/>, root)`这种形式出现的，第一个参数`<App/>`首先会被我们自定义的createElement经由Babel编译成虚拟DOM，第二个参数是父容器.那么仿造此种写法我们就可以实现一个简单的`render`:
```ts
export const render = (virtualDOM: MyReactElement, container: HTMLElement) => {
  // 渲染原生DOM元素
  mountDOMElement(virtualDOM, container)
}

```
现在我们就来实际测试一下结果: 

```ts
/* demo/index.tsx */
import React from "react";
import * as MyReact from "../src/MyReact";
import { MyHTMLElement } from "../src/shared/MyReactTypes";
import './styles.scss'

const vDOM = (
  <div className="container">
    <ul className="todos" ref="todos">
      <li className="completed" onClick={() => alert('completed')}>createElement</li>
      <li className="completed" onClick={() => alert('completed')} >rendering DOM</li>
      <li className="ongoing" onClick={() => alert('ongoing')} >rendering Component</li>
      <li className="todo" onClick={() => alert('todo')} >diff</li>
      <li className="todo" onClick={() => alert('todo')} >state</li>
    </ul>
  </div>
)

const root = document.getElementById('app') as MyHTMLElement
MyReact.render(vDOM, root)
```

为了测试props属性是否生效, 这段tsx中还需要加入了一些简单的样式和点击alert事件


所以在同目录的`styles.scss`中
```scss
.todos {
  .completed {
    color: CornflowerBlue;
  }

  .ongoing {
    color: DarkSalmon;
  }
}

```

如此一来, 打印在页面上的效果就会是这样的, 点击每一个节点, 发现下点击事件也是可以用的. 

以上, 此小节结束. 

