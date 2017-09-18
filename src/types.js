/**
 * @flow
 */

export const COMMENT_TYPE = 'comment'
export const PROPERTY_TYPE = 'property'
export const SELECTOR_TYPE = 'selector'
export const WHITESPACE_TYPE = 'whitespace'

export type CommentNode = {|
  text: string,
  type: 'comment',
|}

export type ParseCommentNodeResponse = {|
  index: number,
  node: CommentNode,
|}

export type WhitespaceNode = {|
  text: string,
  type: 'whitespace',
|}

export type PropertyNode = {|
  between: Array<CommentNode | WhitespaceNode>,
  key: string,
  type: 'property',
  value: string,
|}

export type ParsePropertyNodeResponse = {|
  index: number,
  node: PropertyNode,
|}

export type SelectorNode = {|
  children: Array<CommentNode | PropertyNode | WhitespaceNode>,
  selector: string,
  type: 'selector',
|}

export type ParseSelectorNodeResponse = {|
  index: number,
  node: SelectorNode,
|}

export type ParserOptions = {|
  comments?: boolean,
  whitespace?: boolean,
|}

export type ParseWhitespaceNodeResponse = {|
  index: number,
  node: WhitespaceNode,
|}
