// webpack.config.js 关键地方都有大致注释
var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var autoprefixer = require('autoprefixer');
var flexibility = require('postcss-flexibility');
var sorting = require('postcss-sorting');
var color_rgba_fallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var will_change = require('postcss-will-change');
var cssnano = require('cssnano');

var project = require('./lib/project')();
var config = require('./config.' + project).webpack;


// loaders配置
var getLoaders = function(env) {
    return [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|vendor)/,
        loader: 'babel?presets[]=es2015&cacheDirectory=true!preprocess?PROJECT=' + project
    }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
    }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
    }, {
        test: /\/jquery\.js$/,
        loader: 'expose?$!expose?jQuery!expose?jquery'
    }, {
        test: /\.xtpl$/,
        loader: 'xtpl'
    }, {
        test: /\.modernizrrc$/,
        loader: "modernizr"
    }];
};

// 别名配置
var getAlias = function(env) {
    return {
        // 特殊
        'jquery': path.resolve(__dirname, '../src/vendor/jquery2/jquery.js'),

        // 正常第三方库
        'jquery.js': path.resolve(__dirname, '../src/vendor/jquery2/jquery.js'),
    };
};

// 插件配置
var getPlugins = function(env) {
    var defaultPlugins = [
        // 这个不仅是别名，还可以在遇到别名的时候自动引入模块
        new webpack.ProvidePlugin({
            '$': 'jquery.js',
            'jquery': 'jquery.js',
            'jQuery': 'jquery.js',
        }),
        // 抽离公共模块
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new ExtractTextPlugin(
            path.join('../../stylesheets', project, '/[name].css'), {
                allChunks: true
            }
        )
    ];

    if (env == 'production') {
        // 线上模式的配置，去除依赖中重复的插件/压缩js/排除报错的插件
        plugins = _.union(defaultPlugins, [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                mangle: {
                    except: ['$', 'jQuery']
                }
            }),
            new webpack.NoErrorsPlugin()
        ]);
    } else {
        plugins = _.union(defaultPlugins, []);
    }

    return plugins;
};

// postcss配置
var getPostcss = function(env) {
    var postcss = [
        autoprefixer({ browers: ['last 2 versions', 'ie >= 9', '> 5% in CN'] }),
        flexibility,
        will_change,
        color_rgba_fallback,
        opacity,
        pseudoelements,
        sorting
    ];

    if (env == 'production') {
        // 线上模式的配置，css压缩
        return function() {
            return _.union([
                cssnano({
                    // 关闭cssnano的autoprefixer选项，不然会和前面的autoprefixer冲突
                    autoprefixer: false, 
                    reduceIdents: false,
                    zindex: false,
                    discardUnused: false,
                    mergeIdents: false
                })
            ], postcss);
        };
    } else {
        return function() {
            return _.union([], postcss);
        }
    }
};

// 作为函数导出配置，代码更简洁
module.exports = function(env) {
    return {
        context: config.context,
        entry: config.src,
        output: {
            path: path.join(config.jsDest, project),
            filename: '[name].js',
            chunkFilename: '[name].[chunkhash:8].js',
            publicPath: '/assets/' + project + '/'
        },
        devtool: "eval",
        watch: false,
        profile: true,
        cache: true,
        module: {
            loaders: getLoaders(env)
        },
        resolve: {
            alias: getAlias(env)
        },
        plugins: getPlugins(env),
        postcss: getPostcss(env)
    };
}

// 作者：齐修_qixiuss
// 链接：https://www.jianshu.com/p/9724c47b406c
// 來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。