module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  globals: {
    describe: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    jest: 'readonly'
  },
  rules: {
  }
}
