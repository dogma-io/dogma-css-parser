/**
 * @flow
 */

import {
  COMMENT_TYPE,
  type CommentNode,
  PROPERTY_TYPE,
  type PropertyNode,
  SELECTOR_TYPE,
  type SelectorNode,
  WHITESPACE_TYPE,
  type WhitespaceNode,
} from './types'

function compileNode (
  node: CommentNode | PropertyNode | SelectorNode | WhitespaceNode,
): string {
  switch (node.type) {
    case COMMENT_TYPE:
      return `/*${node.text}*/`

    case PROPERTY_TYPE:
      return `${node.key}:${node.between.map(compileNode).join('')}${node.value}`

    case SELECTOR_TYPE:
      return `${node.selector} {${node.children.map(compileNode).join('')}}`

    case WHITESPACE_TYPE:
      return node.text

    default:
      throw new Error(`Unknown type ${node.type}`)
  }
}

export default function (
  nodes: Array<CommentNode | SelectorNode | WhitespaceNode>,
): string {
  return nodes
    .map(compileNode)
    .join('')
}
