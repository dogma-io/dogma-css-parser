/**
 * @flow
 */

import {
  COMMENT_TYPE,
  type CommentNode,
  type ParseCommentNodeResponse,
  type ParsePropertyNodeResponse,
  type ParserOptions,
  type ParseSelectorNodeResponse,
  type ParseWhitespaceNodeResponse,
  PROPERTY_TYPE,
  SELECTOR_TYPE,
  type SelectorNode,
  WHITESPACE_TYPE,
  type WhitespaceNode,
} from './types'

const WHITESPACE = /\s/

function parseCommentNode (
  content: string,
  start: number,
  options: ParserOptions,
): ParseCommentNodeResponse {
  let end = start

  while (content[end] !== '*' || content[end + 1] !== '/') {
    if (end > content.length - 1) {
      throw new Error('Failed to finish parsing comment')
    }

    ++end
  }

  return {
    index: end + 2,
    node: {
      text: content.slice(start + 2, end), // Removing "/*" and "*/"
      type: COMMENT_TYPE,
    },
  }
}

function parsePropertyNode (
  content: string,
  start: number,
  options: ParserOptions,
): ParsePropertyNodeResponse {
  let end = 0

  while (content[end] !== ':') {
    if (end > content.length - 1) {
      throw new Error('Failed to finish parsing property')
    }

    ++end
  }

  const key = content.slice(start, end)

  // Skip ":"
  ++end

  const between = []

  while (
    WHITESPACE.test(content[end]) ||
    (content[end] === '/' && content[end + 1] === '*')
  ) {
    if (WHITESPACE.test(content[end])) {
      const state = parseWhitespaceNode(content, end, options)

      if (options.whitespace) {
        between.push(state.node)
      }

      end = state.index
    } else {
      const state = parseCommentNode(content, end, options)

      if (options.comments) {
        between.push(state.node)
      }

      end = state.index
    }
  }

  const valueStart = end

  while (content[end] !== ';') {
    if (end > content.length - 1) {
      throw new Error('Failed to finish parsing property')
    }

    ++end
  }

  return {
    index: ++end, // Skipping to character past ";"
    node: {
      between,
      key,
      type: PROPERTY_TYPE,
      value: content.slice(valueStart, end - 1),
    },
  }
}

function parseSelectorNode (
  content: string,
  start: number,
  options: ParserOptions,
): ParseSelectorNodeResponse {
  let end = start

  while (content[end] !== '{') {
    if (end > content.length - 1) {
      throw new Error('Failed to finish parsing selector')
    }

    ++end
  }

  const children = []
  const selector = content.slice(start, end)

  ++end // Skip "{"

  while (content[end] !== '}') {
    if (end > content.length - 1) {
      throw new Error('Failed to finish parsing selector')
    } else if (WHITESPACE.test(content[end])) {
      const state = parseWhitespaceNode(content, end, options)
      if (options.whitespace) children.push(state.node)
      end = state.index
    } else if (content[end] === '/' && content[end + 1] === '*') {
      const state = parseCommentNode(content, end, options)
      if (options.comments) children.push(state.node)
      end = state.index
    } else {
      const state = parsePropertyNode(content, end, options)
      children.push(state.node)
      end = state.index
    }
  }

  return {
    index: ++end, // Skipping to character past "}"
    node: {
      children,
      selector: options.whitespace ? selector : selector.trim(),
      type: SELECTOR_TYPE,
    },
  }
}

function parseWhitespaceNode (
  content: string,
  start: number,
  options: ParserOptions,
): ParseWhitespaceNodeResponse {
  let end = start + 1
  while (WHITESPACE.test(content[end])) ++end

  return {
    index: end,
    node: {
      text: content.slice(start, end),
      type: WHITESPACE_TYPE,
    },
  }
}

export default function (
  content: string,
  options: ParserOptions,
): Array<CommentNode | SelectorNode | WhitespaceNode> {
  const nodes = []
  let index: number = 0

  options = Object.assign({
    comments: false,
    whitespace: false,
  }, options)

  while (index < content.length) {
    if (WHITESPACE.test(content[index])) {
      const state = parseWhitespaceNode(content, index, options)
      if (options.whitespace) nodes.push(state.node)
      index = state.index
    } else if (content[index] === '/' && content[index + 1] === '*') {
      const state = parseCommentNode(content, index, options)
      if (options.comments) nodes.push(state.node)
      index = state.index
    } else {
      const state = parseSelectorNode(content, index, options)
      nodes.push(state.node)
      index = state.index
    }
  }

  return nodes
}
