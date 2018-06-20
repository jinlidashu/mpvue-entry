const path = require('path');
const assert = require('assert');
const Template = require('../lib/utils/template');
const genEntry = require('../lib/utils/compiler');
const { resolveApp, resolveModule } = require('../lib/utils/resolve');
const { removeFile } = require('../lib/utils/file');

function resolveTest(dir) {
  return path.join(__dirname, '../test', dir);
}

describe('utils', () => {
  describe('resolveApp', () => {
    it('should return a path relative to app', () => {
      assert.equal(resolveApp('./test'), resolveTest('../node_modules/mocha/test'));
    });
  });

  describe('resolveModule', () => {
    it('should return a path relative to module', () => {
      assert.equal(resolveModule('./test'), resolveTest('.'));
    });
  });

  describe('template', () => {
    it('should return template string', () => {
      const template = new Template();
      template.refresh({ template: resolveTest('./assets/main.js') });
      assert.equal(template.content, `import Vue from 'vue';
import store from '@/store';
import App from '@/App';

Vue.config.productionTip = false;

const app = new Vue({
  store,
  ...App,
});
app.$mount();

export default {
  config: {
    pages: [
      '^pages/news/list',
    ],
    window: {
      backgroundTextStyle: 'light',
    },
  },
};
`);
    });
  });

  describe('genEntry', () => {
    const paths = {
      pages: resolveTest('./assets/pages.js'),
      template: resolveTest('./assets/main.js'),
      app: resolveTest('../dist/app.json'),
      entry: resolveTest('./'),
    };
    it('should return entry object', () => {
      genEntry(paths, 'initial').then((entry) => {
        assert.equal(entry.app, resolveTest('./assets/main.js'));
        assert.equal(entry['pages/a'], resolveTest('./pageA.js'));
        removeFile([entry['pages/a'], entry['pages/b']]);
      });
    });
  });
});
