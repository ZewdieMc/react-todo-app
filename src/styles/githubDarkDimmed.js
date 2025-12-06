// GitHub Dark Dimmed theme for react-syntax-highlighter
// Colors based on GitHub's Dark Dimmed color scheme

const githubDarkDimmed = {
  'code[class*="language-"]': {
    color: '#adbac7',
    background: 'none',
    fontFamily: "'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#adbac7',
    background: '#b1d8c9ff',
    fontFamily: "'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  comment: {
    color: '#0da727ff',
    fontStyle: 'italic',
  },
  prolog: {
    color: '#768390',
  },
  doctype: {
    color: '#768390',
  },
  cdata: {
    color: '#768390',
  },
  punctuation: {
    color: '#adbac7',
  },
  namespace: {
    opacity: '0.7',
  },
  property: {
    color: '#6cb6ff',
  },
  tag: {
    color: '#8ddb8c',
  },
  boolean: {
    color: '#a72ea7ff',
  },
  number: {
    color: '#6cb6ff',
  },
  constant: {
    color: '#ec1616ff',
  },
  symbol: {
    color: '#6cb6ff',
  },
  deleted: {
    color: '#f47067',
  },
  selector: {
    color: '#8ddb8c',
  },
  'attr-name': {
    color: '#6cb6ff',
  },
  string: {
    color: '#96d0ff',
  },
  char: {
    color: '#96d0ff',
  },
  builtin: {
    color: '#dcbdfb',
  },
  inserted: {
    color: '#8ddb8c',
  },
  operator: {
    color: '#f47067',
  },
  entity: {
    color: '#dcbdfb',
    cursor: 'help',
  },
  url: {
    color: '#96d0ff',
  },
  '.language-css .token.string': {
    color: '#96d0ff',
  },
  '.style .token.string': {
    color: '#96d0ff',
  },
  variable: {
    color: '#f69d50',
  },
  atrule: {
    color: '#dcbdfb',
  },
  'attr-value': {
    color: '#96d0ff',
  },
  function: {
    color: '#dcbdfb',
  },
  'class-name': {
    color: '#f69d50',
  },
  keyword: {
    color: '#f47067',
  },
  regex: {
    color: '#96d0ff',
  },
  important: {
    color: '#f47067',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};

export default githubDarkDimmed;
