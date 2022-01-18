
import { isEqual } from '../shared/utils'

export const shouldComponentUpdate = (prevProps: { [key: string]: any }, props: { [key: string]: any }) => {
  return !isEqual(prevProps, props)
}

export const componentDidUpdate = (prevProps: { [key: string]: any }) => {

}