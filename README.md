
Для запуска сборки склонируйте ее к себе в директорию, далее выполните следующие команды
1. Установка зависимостей:
npm i
2. Запуск сборки:
a. Запуск dev-сервера
npm run dev
б. Компиляция проекта на продакшн
npm run build

## Основной используемый стек:
- webpack, babel
- PostCSS, SASS, normilize.css
- SVG
- PUG
- Vue.js, Vuex (для примера)

## Структура папок и файлов
```
├── dist/                         # Билд проекта
├── config/                       # Настройки webpack
│   ├── webpack.base.conf.js      # Общие настройки Webpack
│   ├── webpack.build.conf.js     # Настройки для билда
│   └── webpack.dev.conf.js       # Настройки для разработки
├── src/                          # Исходники
│   ├── assets/                   # Файлы-ассеты
│   │   ├── css                   # Сторонние CSS
│   │   ├── fonts                 # Используемые шрифты
│   │   ├── img                   # Изображения
│   │   │   └── icon              # SVG-иконки
│   │   └── scss                  # SCSS-таблицы стилей
│   ├── components/               # Vue-компоненты
│   ├── js/                       # JS-скрипты
│   ├── pug/                      # PUG
│   │   ├── includes              # Подключаемые секции
│   │   │   └── modules           # Модули часто используемых секций
│   │   ├── layout                # pug-шаблоны страниц
│   │   ├── pages                 # Страницы проекта
│   │   └── utils                 # Используемые pug-миксины
│   ├── static/                   # Папка для хранения favicon, sitemap, ...
│   ├── store/                    # Пример для использования Vuex-хранилища
│   ├── index.js                  # Основная точка входа
│   └── lk.js                     # Пример дополнительной (следующей после основной) точки входа
├── .gitignore                    # Список исключённых файлов (из Git)
├── package.json                  # Список зависимостей и прочей информации проекта
├── README.md                     # Документация проекта
├── .babelrc                      # Настройки babel
└── postcss.config.js             # Настройки PostCSS
```

## Структура package.json
```
{
  "name": "webpacktemplate",
  "version": "1.0.0",
  "description": "My template",
  "main": "index.js",
  "scripts": {
    // скрипт разработки проекта
    "dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
    // скрипт компиляции проекта на продакшн
    "build": "webpack --config ./build/webpack.build.conf.js",
    // скрипт, подсчитывающий кол-во комментариев, пустых строк и т.п.
    "cloc": "./node_modules/.bin/cloc --exclude-dir node_modules,.meteor,.vscode,typings,typings-own,.git,.idea ./"
  },
  "browserslist": [ // настройки для autoprefixer
    "> 1%",
    "last 3 version"
  ],
  "repository": { // удаленный репозиторий
    "type": "git",
    "url": "git+https://github.com/microlabig/webpack1.git"
  },
  "author": "Igor Bezmestin",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/microlabig/webpack1/issues"
  },
  "homepage": "https://github.com/microlabig/webpack1#readme",
  // необходимые зависимости для разработки проекта
  "devDependencies": { 
    // ...
  },
  // необходимые зависимости для запуска проекта 
  "dependencies": {
    // ...
  }
}
```

## Настройки babel
```
// .babelrc
{
    "presets": [ // массив с используемыми пресетами
        // использование переменных окружения
        "@babel/preset-env"
    ],
    "plugins": [
        // возможность использования динамического импорта
        // подробнее на https://habr.com/ru/post/455200/
        "@babel/plugin-syntax-dynamic-import"
    ]
}
```

