const COMMENT_TYPE = 'comment'
const WHITESPACE_NODE = 'whitespace'

function esc (text) {
  return text
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
}

export default function (parse) {
  ;[
    {
      inputs: [
        '/*Test*/',
      ],
      options: {
        comments: true,
      },
      tree: [
        {
          text: 'Test',
          type: COMMENT_TYPE,
        },
      ],
    },
    {
      inputs: [
        '/*Test*/',
      ],
      options: {
        comments: false,
      },
      tree: [],
    },
    {
      inputs: [
        ' \t\n',
      ],
      options: {
        whitespace: true,
      },
      tree: [
        {
          text: ' \t\n',
          type: WHITESPACE_NODE,
        },
      ],
    },
    {
      inputs: [
        ' \t\n',
      ],
      options: {
        whitespace: false,
      },
      tree: [],
    },
    {
      inputs: [
        ' \t\n/*Test*/\n\t ',
      ],
      options: {
        comments: true,
        whitespace: true,
      },
      tree: [
        {
          text: ' \t\n',
          type: WHITESPACE_NODE,
        },
        {
          text: 'Test',
          type: COMMENT_TYPE,
        },
        {
          text: '\n\t ',
          type: WHITESPACE_NODE,
        },
      ],
    },
    {
      inputs: [
        ' \t\n/*Test*/\n\t ',
      ],
      options: {
        comments: false,
        whitespace: false,
      },
      tree: [],
    },
    {
      inputs: [
        ' \t\n/*Test*/\n\t ',
      ],
      options: {
        comments: false,
        whitespace: true,
      },
      tree: [
        {
          text: ' \t\n',
          type: WHITESPACE_NODE,
        },
        {
          text: '\n\t ',
          type: WHITESPACE_NODE,
        },
      ],
    },
    {
      inputs: [
        ' \t\n/*Test*/\n\t ',
      ],
      options: {
        comments: true,
        whitespace: false,
      },
      tree: [
        {
          text: 'Test',
          type: COMMENT_TYPE,
        },
      ],
    },
  ]
    .forEach(({inputs, options, tree}) => {
      inputs.forEach((input) => {
        it(esc(`input (${JSON.stringify(options)})`), () => {
          expect(parse(input, options)).toEqual(tree)
        })
      })
    })
}
