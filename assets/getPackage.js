module.exports.getPackage = (name) => `{
  "private": true,
  "name": "${name}",
  "version": "1.0.0",
  "description": "> TODO: description",
  "author": "Ryota Suzuki",
  "license": "MIT",
  "main": "./dist/index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/suzukun/javascript-packages.git"
  },
  "bugs": {
    "url": "https://github.com/suzukun/javascript-packages/issues"
  },
  "homepage": "https://github.com/suzukun/javascript-packages/tree/develop/packages/${name}#readme",
  "files": [
    "dist"
  ],
  "lint-staged": {
    "*.ts": [
      "eslint --ext .ts --fix .",
      "git add"
    ]
  },
  "scripts": {
    "start": "ts-node index.ts",
    "build": "webpack",
    "test": "jest --passWithNoTests",
    "lint": "eslint --ext .ts --fix .",
    "doc": "typedoc",
    "precommit": "lint-staged"
  }
}
`;
