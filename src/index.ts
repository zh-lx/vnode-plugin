import startServer from './server';
import injectCode from './get-inject-code';
class TrackCodePlugin {
  apply(complier) {
    complier.hooks.compilation.tap('TrackCodePlugin', (compilation) => {
      startServer((port) => {
        const code = injectCode(port);
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
          'HtmlWebpackPlugin',
          (data) => {
            // html-webpack-plugin编译后的内容，注入代码
            data.html = data.html.replace('</body>', `${code}\n</body>`);
          }
        );
      });
    });
  }
}

export = TrackCodePlugin;
