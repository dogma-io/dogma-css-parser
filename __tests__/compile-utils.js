const COMMENT_TYPE = 'comment'

export default function (compile) {
  ;[
    {
      desc: 'comment',
      input: [
        {
          text: 'Test',
          type: COMMENT_TYPE,
        },
      ],
      output: '/*Test*/',
    },
    {
      desc: 'comment with whitepsace',
      input: [
        {
          text: ' \t\nTest\n\t ',
          type: COMMENT_TYPE,
        },
      ],
      output: '/* \t\nTest\n\t */',
    },
  ]
    .forEach(({desc, input, output}) => {
      it(desc, () => {
        expect(compile(input)).toBe(output)
      })
    })
}
