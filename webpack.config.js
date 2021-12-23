const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
    // devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  // 需要解析的文件类型
  resolve: {
    extensions: ['.ts', '.tsx', '.json', '.js'],
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: "babel-loader"
      // },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
      }
    ]
  },
  plugins: [
    // 在构建之前将dist文件夹清理掉
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./dist"]
    }),
    // 指定HTML模板, 插件会将构建好的js文件自动插入到HTML文件中
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {
    // 指定开发环境应用运行的根据目录
    // contentBase: "./dist",
    // 指定控制台输出的信息
    // stats: "errors-only",
    // 不启动压缩
    compress: false,
    host: "localhost",
    port: 5000,
    hot: true,
  }
}

