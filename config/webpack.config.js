const path = require("path");
const os = require("os");
const HappyPack = require("happypack");
const tsImportPluginFactory = require("ts-import-plugin"); // babel-plugin-import的ts版本
console.log(666);
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      components: path.resolve(__dirname, "../src/components")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "happypack/loader?id=happyBabel" },
          { loader: "happypack/loader?id=ts" }
        ],
        include: path.join(process.cwd(), "src")
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: "ts",
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: "ts-loader",
          options: {
            happyPackMode: true,
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory(
                  {
                    libraryName: "antd",
                    libraryDirectory: "es",
                    style: true
                  },
                  {
                    libraryName: "@/components",
                    libraryDirectory: "",
                    camel2UnderlineComponentName: false,
                    camel2DashComponentName: false
                  },
                  {
                    libraryName: "lodash",
                    libraryDirectory: "",
                    camel2DashComponentName: false // default: true
                  }
                )
              ]
            })
          }
        }
      ]
    }),
    new HappyPack({
      id: "happyBabel",
      loaders: [
        {
          loader: "babel-loader?cacheDirectory=true"
        }
      ],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true
    })
  ]
};
