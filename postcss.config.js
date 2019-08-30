// npm install postcss-loader autoprefixer css-mqpacker cssnano postcss-pxtorem postcss-inline-svg --save-dev

module.exports = {
    plugins: [
        require('autoprefixer'), // автопрефиксер
        require('css-mqpacker'), // группировка всех одинаковых медиазапросов 
        require('postcss-inline-svg')({ // инлайновые svg
            removeFill: true,
            paths: ["./src/assets/img/icons/"]
        }),
        require('cssnano') ({ // уменьшение css
            preset: [
                'default', {
                    discardComments: { 
                        removeAll: true // удаление комментариев
                    }
                }
            ]
        }),
        require('postcss-pxtorem')({ // px2rem
            rootValue: 16,  // по-умолчанию, размер шрифта 16px
            propList: ["*", "!*border*"], // игнорировать CSS св-ва, в которых содержится слово "border"
            selectorBlackList: [/^(html|pug)$/] // игнорировать в html- и pug-файлах
        })
    ]
}