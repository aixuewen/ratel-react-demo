const path = require("path");
const utils = require("./utils");
const config = require("../config");
const marked = require("marked");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const multiHelper = require('./multipage-helper');
const devMode = process.env.NODE_ENV !== 'production'

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  entry: { //入口文件
    ...multiHelper.getEntries()
  },
  output: { //输出配置
    path: config.build.assetsRoot, ////输出文件路径配置
    filename: "[name].js", //// 输出文件名
    publicPath: process.env.NODE_ENV === "production" ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".jsx", '.ts', '.tsx', ".json"],
    modules: [resolve("src"), resolve("node_modules")],
    alias: {
      '@static': resolve('static'),
      '@': resolve("src"),
      '@assets': resolve("src/assets"),
      '@components': resolve("src/components"),
      '@config': resolve("src/config"),
      '@mocks': resolve("src/mocks"),
      '@redux': resolve("src/redux"),
      '@routes': resolve("src/routes"),
      '@services': resolve("src/services"),
      '@utils': resolve("src/utils"),
      '@views': resolve("src/views")
    }
  },
  module: {
    rules: [
      //   {
      //   test: /\.jsx$/,
      //   loader: 'webpack-px2rem-loader',
      //   // 这个配置是可选的
      //   query: {
      //     // 1rem=npx 默认为 10
      //     basePx: 37.5,
      //     // 只会转换大于min的px 默认为0
      //     // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示
      //     min: 1,
      //     // 转换后的rem值保留的小数点后位数 默认为3
      //     floatWidth: 3
      //   }
      // }, 

      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [resolve("src"), resolve("test")],
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: [resolve("src"), resolve("test")],
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "file-loader",
        query: {
          publicPath: '../../',
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }, {
        test: /\.md$/,
        use: [{
          loader: "html-loader"
        }, {
          loader: "markdown-loader"
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: "css-loader"
        }]
      },
      {
        // antd 自定义主题
        test: /\.less$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              modifyVars: {
                "@icon-url": process.env.NODE_ENV === "production" ?
                  '"/bonc-industry-fronted/static/iconfont/iconfont"' : '"/static/iconfont/iconfont"'
              }
            }
          }
        ]
      }
    ]
  }
};
