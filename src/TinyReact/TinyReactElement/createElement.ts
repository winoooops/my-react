export function createElement(type: string, props: any, ...children: any) {
  const childElements = Array.from(children).reduce((result: any[], child: any) => {
    // 去除true false null节点
    if (child !== true && child !== false && child !== null) {
      if (child instanceof Object) {
        // 如果为数组
        if (child instanceof Array) {
          child.forEach(node => result.push(node))
        } else {
          result.push(child)
        }
      } else {
        // 改造文本节点
        result.push(createElement('text', { textContent: child }))
      }
    }
    return result
  }, [])

  const propsElements = Object.assign({}, props, { children: childElements })

  return {
    type,
    props: propsElements,
    childElements
  }
}