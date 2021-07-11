import path from 'path';
import fs from 'fs';
import startServer from './server';
import injectCode from './get-inject-code';
let _options: {
  [key: string]: Function;
} = {};
class TrackCodePlugin {
  constructor(
    options: {
      [key: string]: Function;
    } = {}
  ) {
    _options = options;
  }
  apply(complier) {
    complier.plugin('compilation', (compilation) => {
      startServer((port) => {
        const code = injectCode(port, _options);
        compilation.plugin(
          'html-webpack-plugin-after-html-processing',
          (data) => {
            // html-webpack-plugin编译后的内容，注入代码
            data.html = data.html.replace(
              '</body>',
              `<script>\n${code}\n</script>\n</body>`
            );
          }
        );
      });
    });
  }
}

export = TrackCodePlugin;
