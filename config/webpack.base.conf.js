const path = require('path'); // для корректного поиска путей на кроссплатформах
const fs = require('fs'); // для доступа к файловой системе
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // для подключения css в index.js (генерирует отдельный CSS-файл, который будет подключаться в HTML-файл обычным образом через тег <link> (не инлайново как в теге style))
const CopyWebpackPlugin = require('copy-webpack-plugin'); // для копирования статичных файлов (из папки static, изображений и шрифтов)
const HtmlWebpackPlugin = require('html-webpack-plugin'); // для работы с HTML-файлами
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin"); // для обработки векторных изобрадений
const { VueLoaderPlugin } = require('vue-loader'); // для работы с Vue
const TerserPlugin = require('terser-webpack-plugin'); // вместо устаревшего uglifyJS

// Основные consts - пути
const PATHS = { // глобальная константа
    src: path.join(__dirname,'../src'),
    dist: path.join(__dirname,'../dist'),
    assets: 'assets/'
}

// Для PUG (Pages consts)
// const PAGES_DIR = PATHS.src
const PAGES_DIR = `${PATHS.src}/pug/pages`; // где брать pug-файлы
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug')); // массив pug-страниц проекта

module.exports = {
    externals: { // для получения доступа к вышестоящей константе PATHS для других конфигов (webpack.build.conf.js и webpack.dev.conf.js)
        paths: PATHS // передадим основные константы с путями в переменную paths
    },
    // точка входа
    entry: {
        app: ["@babel/polyfill/noConflict", PATHS.src], // Если вам нужно загрузить полифайл (@babel/polyfill) более одного раза, используйте @babel/polyfill/noConflict, чтобы обойти предупреждение.
        lk: ["@babel/polyfill/noConflict", `${PATHS.src}/lk.js`] // напр., личный кабинет
    },
    // точка выхода
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`, // будет app.js и lk.js, т.к. в точке входа мы определили переменную с именами "app" и "lk"
        path: PATHS.dist, // каталог для вывода
        publicPath: '/' // для devservera (указывает относительный путь к папке)
    },
    // настройки оптимизаци для js-файлов    
    optimization: {
        // для уменьшения js-файлов
        minimizer: [ 
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                exclude: '/node_modules/', // исключаем папку node_modules
                cache: true, 
                parallel: true,
                sourceMap: false
            }),
        ],
        // разделять файлы js (напр., vendor.js, app.js, lk.js, ...)
        // https://tproger.ru/translations/configure-webpack4/
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors', // как называтся будет выходной js-файл для используемых библиотек (напр., Vue.js)
                    test: /node_modules/, // где смотреть (какой каталог)
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    // loaders
    module: { 
        // правила (массив объектов) преобразования определённых файлов соответствующими загрузчиками
        rules: [ 
            // изображения
            { 
                test: /\.(png|jpe?g|gif?)$/, // обращаемся ко всем изображениям и шрифтам
                loaders: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            // шрифты
            { 
                //test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, // обращаемся к шрифтам
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, // обращаемся к шрифтам
                loaders: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            // PUG
            { 
                test: /\.pug$/, // обращаемся к pug
                oneOf: [ // oneOf - массив Правил, из которого используется только первое соответствующее Правило, когда Правило совпадает.
                    {
                      resourceQuery: /^\?vue/,
                      use: ["pug-plain-loader"]
                    },
                    {
                      use: ["pug-loader"]
                    }
                  ]
            },
            // векторные изображения
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-sprite-loader",
                        options: {
                            extract: true,
                            //spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
                        }
                    },
                    "svg-transform-loader",
                    {
                        loader: "svgo-loader",
                        options: {
                        plugins: [
                                { removeTitle: true },
                                {
                                    removeAttrs: {
                                        attrs: "(fill|stroke)"
                                    }
                                }
                            ]
                        }
                    }
                ]
            },     
            // скрипты   
            { 
                test: /\.js$/, // обращаемся ко всем js файлам
                loaders: 'babel-loader',
                exclude: '/node_modules/', // исключаем папку node_modules
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ["@babel/plugin-syntax-dynamic-import"] // динамический импорт и для async/await
                }
            },
            // VUE
            { 
                test: /\.vue$/, // обращаемся ко всем vue файлам
                loaders: 'vue-loader',
                options: {
                    loader: {
                        scss: 'vue-style-loader!css-loader!sass-loader' // указывает на обработку css-стилей
                    }
                }
            },
            // SCSS
            {
                test: /\.scss$/, // обработка scss
                use: [ // use - SCSS-файлы обрабатываются последовательно несколькими загрузчиками, поэтому вместо свойства loader здесь используется свойство use
                    // в случае с несколькими загрузчиками, они работают в следующем порядке: снизу вверх или справа налево
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true, 
                            config: {
                                path: `./postcss.config.js`
                            } 
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {sourceMap: true}
                    }                    
                ]
            },
            // CSS
            {
                test: /\.css$/, // обработка css
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true, 
                            config: {
                                path: `./postcss.config.js`
                            } 
                        }
                    }
                ]
            }
        ]
    },
    // допустимы замены
    resolve: {        
        alias: { // для сокращения в вызовах 
            '~' : 'src', // универсальный заменитель (напр., для импорта во vue-файлах)
            'vue$': 'vue/dist/vue.js', // vue заменится на vue/dist/vue.js
        },
        extensions: ["*", ".js", ".vue", ".json"] // дефолтные расширения файлов, которые наше прилодение будет импортировать
    },
    // зарегистрируем используемые плагины
    plugins: [ 
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[hash].css` // на выходе будет app.[hash].css
        }),
        /* 
        // для .html
        new HtmlWebpackPlugin({
            // https://github.com/jaketrent/html-webpack-template/blob/legacy/index.html
            template: `${PATHS.src}/index.html`,
            filename: './index.html',
            inject: false // false - отключает автоматическую вставку css (<link rel=...> в head) и js (<script...> вниз body)
        }),
        */
        new CopyWebpackPlugin([ // плагин копирует файлы из папки from в папку to (относительно output.path)
            {
                from: `${PATHS.src}/${PATHS.assets}img`,
                to: `${PATHS.assets}img`
            },
            {
                from: `${PATHS.src}/${PATHS.assets}fonts`,
                to: `${PATHS.assets}fonts`
            },
            {
                from: `${PATHS.src}/static`,
                to: ''
            }
        ]),
        new SpriteLoaderPlugin({ 
            plainSprite: true 
        }),
        new VueLoaderPlugin(),

        // Automatic creations any html pages (Don't forget to RERUN dev server)
        ...PAGES.map( page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`, // .pug
            //filename: `./${page}` // для html -> html
            filename: `./${page.replace(/\.pug$/,'.html')}` // .html
        }))
    ]
}