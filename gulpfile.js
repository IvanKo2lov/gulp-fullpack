import browserSync from 'browser-sync';// https://www.npmjs.com/package/browser-sync
import {deleteAsync} from "del";// https://www.npmjs.com/package/del
import gulp from 'gulp'; // https://www.npmjs.com/package/gulp
import autoprefixer from 'gulp-autoprefixer';// https://www.npmjs.com/package/gulp-autoprefixer
import cleanCSS from "gulp-clean-css";// https://www.npmjs.com/package/gulp-clean-css
import fileInclude from "gulp-file-include";// https://www.npmjs.com/package/gulp-file-include
import fonter from "gulp-fonter";// https://www.npmjs.com/package/gulp-fonter
import gcmq from "gulp-group-css-media-queries";// https://www.npmjs.com/package/gulp-group-css-media-queries
import htmlmin from 'gulp-htmlmin';// https://www.npmjs.com/package/gulp-htmlmin
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';// https://www.npmjs.com/package/gulp-imagemin
import rename from 'gulp-rename';// https://www.npmjs.com/package/gulp-rename
import replace from "gulp-replace";// https://www.npmjs.com/package/gulp-replace
import gulpSass from 'gulp-sass';// https://www.npmjs.com/package/gulp-sass
import svgSprite from 'gulp-svg-sprite';// https://www.npmjs.com/package/gulp-svg-sprite
import ttf2woff2 from "gulp-ttf2woff2";// https://www.npmjs.com/package/gulp-ttf2woff2
import version from "gulp-version-number";// https://www.npmjs.com/package/gulp-version-number
import webp from "gulp-webp";// https://www.npmjs.com/package/gulp-webp
import webphtml from 'gulp-webp-html-nosvg';// https://www.npmjs.com/package/gulp-webp-html-nosvg
import webpcss from "gulp-webpcss";// https://www.npmjs.com/package/gulp-webpcss
import dartSass from 'sass'; // https://www.npmjs.com/package/sass
import webpack from "webpack-stream";// https://www.npmjs.com/package/webpack-stream
import gulpif from "gulp-if";//https://www.npmjs.com/package/gulp-if
import newer from "gulp-newer";// https://www.npmjs.com/package/gulp-newer
import fontfacegen from './fontFaceGenerator.js';//Доработка https://www.npmjs.com/package/font-face-generator
import zip from 'gulp-zip';//https://www.npmjs.com/package/gulp-zip

/*
Доп:


https://github.com/browserslist/browserslist
 */


const isBuild = process.argv.includes('--build');//true если в режиме сборки
const isDev = !process.argv.includes('--build');//true если в режиме разработки
const buildPath = `./src/../../build`;//Путь куда ложить сборку. /../ - означает перейти на папку выше
const rootPath = `/`;//Путь к корню
const srcPath = `./src`;//Путь к папке с исходными файлами


//Очистка папки build
const clean_build = () => {
    return deleteAsync(`${buildPath}/`, {force: true});
}

//Копирование файлов в папку build
const copy_css_to_build = () => {
    return gulp.src(`${srcPath}/css/**/*.*`).pipe(gulp.dest(`${buildPath}/css/`));
}
const copy_js_to_build = () => {
    return gulp.src(`${srcPath}/js/**/*.*`).pipe(gulp.dest(`${buildPath}/js/`));
}
const copy_html_to_build = () => {
    return gulp.src(`${srcPath}/html/**/*.*`).pipe(gulp.dest(`${buildPath}/html/`));
}
const copy_fonts_to_build = () => {
    return gulp.src(`${srcPath}/font/**/*.*`).pipe(gulp.dest(`${buildPath}/font/`));
}
const copy_version_to_build = () => {
    return gulp.src(`${srcPath}/../version.json`).pipe(gulp.dest(`${buildPath}/../`));
}


//Scss обработка
const sass = gulpSass(dartSass);
const scss = () => {
    return gulp.src(`${srcPath}/css/**/*.scss`, {sourcemaps: isDev})//sourcemap использовать только в режиме разработки
        //.pipe(replace('@img', 'assets/img'))// Заменить какие либо вхождения в css
        .pipe(sass())//sass в css
        .pipe(gcmq())// Объединяем media queries
        .pipe(webpcss({//Добавляет стили с ипользованием webp формата.
            webpClass: '.webp',//такой класс будет у родительского контейнера(в нашем случае у body) если есть поддержка webp
            noWebpClass: '.not-webp'//Класс если нет поддержки webp
        }))
        .pipe(autoprefixer({//Добавляем префиксы для кроссбраузерности
            grid: true,
            cascade: true
        }))
        .pipe(gulp.dest(`${buildPath}/css/`))
        .pipe(cleanCSS())//Минификация и очистка от лишнего кода
        .pipe(rename({
            extname: ".min.css"
        }))//Переименуем чтобы сохранить как .min
        .pipe(gulp.dest(`${buildPath}/css/`))
        .pipe(browserSync.stream())//Отсылам сигнал на синхронизацию с браузером
}
//js обработка
const js = () => {
    return gulp.src(`${srcPath}/js/**/*.js`, {sourcemaps: isDev})
        .pipe(webpack({//Сборка js файлов. Минификация и очистка
            mode: isBuild ? "production" : "development",
            output: {
                filename: 'main.min.js'
            }
        }))
        .pipe(gulp.dest(`${buildPath}/js/`))
        .pipe(browserSync.stream())//Отсылам сигнал на синхронизацию с браузером
}
//html обработка
const html = () => {
    return gulp.src(`${srcPath}/*.html`)
        .pipe(fileInclude({//соединям html файлы
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace('@root/', rootPath))//Заменяем вхождение @root на путь к корню
        .pipe(webphtml())//Заменяем img на picture с поддержкой webp
        .pipe(gulpif(isBuild, version({//Если режим сборки, то добавляем версию к пути файла для того чтобы у пользователей обновился кэш
            'value': '%MDS%',
            'append': {
                'key': '_v',
                'cover': 0,
                'to': [
                    'css',
                    'js'
                ]
            },
            'output': {
                'file': 'version.json'
            }
        })))
        .pipe(gulpif(isBuild, htmlmin({collapseWhitespace: true})))//Минификация html режиме сборки - если мешает отключить.
        .pipe(gulp.dest(`${buildPath}/`))
        .pipe(browserSync.stream())//Отсылам сигнал на синхронизацию с браузером
}

//Обработка изображений
const images = () => {
    return gulp.src(`${srcPath}/images/**/*.{jpg,jpeg,png,gif,webp}`)
        .pipe(newer(`${buildPath}/images/`))//Фильтрует файлы. Остаются только те, исходники которых новее в папке билда. Чтобы каждый раз не обрабатывать все изображения
        .pipe(webp())//Создает webp версии файлов
        .pipe(gulp.dest(`${buildPath}/images/`))
        .pipe(gulp.src(`${srcPath}/images/**/*.{jpg,jpeg,png,gif,webp}`))
        .pipe(newer(`${buildPath}/images/`))//Фильтрует файлы. Остаются только те, исходники которых новее в папке билда. Чтобы каждый раз не обрабатывать все изображения
        .pipe(imagemin([//Минифицирует изображения. Параметры дефолтные. Подробнее в доке плагина.
            gifsicle({interlaced: true}),
            mozjpeg({quality: 75, progressive: true}),
            optipng({optimizationLevel: 3}),
            svgo({
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: false
                    },
                    {
                        name: 'cleanupIDs',
                        active: false
                    }
                ]
            })
        ]))
        .pipe(gulp.dest(`${buildPath}/images/`))
        .pipe(gulp.src(`${srcPath}/images/**/*.svg`))//Svg просто копируем
        .pipe(gulp.dest(`${buildPath}/images/`))
        .pipe(browserSync.stream())//Отсылам сигнал на синхронизацию с браузером
}
//Иконки в спрайты
const icons = () => {
    return gulp.src(`${srcPath}/images/icons/*.svg`)
        .pipe(svgSprite({//svg иконки объединяются в 1 файл спрайта icons.svg
            mode: {
                stack: {
                    sprite: `../icons.svg`,
                    example: false//Включить генерацию html файла с примерами иконок=к
                }
            }
        }))
        .pipe(gulp.dest(`${buildPath}/images/`))
        .pipe(browserSync.stream())//Отсылам сигнал на синхронизацию с браузером
}
//Шрифты конвертация( конвертируются в папку сисходниками)
const oftToTft = () => {
    return gulp.src(`${srcPath}/font/*.otf`, {})
        .pipe(fonter({formats: ['ttf']}))//если есть otf, то создаем из него ttf
        .pipe(gulp.dest(`${srcPath}/font/`))
}

const ttfToWoff = () => {
    return gulp.src(`${srcPath}/font/*.ttf`, {})
        .pipe(fonter({formats: ['woff']}))//ttf в woff
        .pipe(gulp.dest(`${srcPath}/font/`))
        .pipe(gulp.src(`${srcPath}/font/*.ttf`))
        .pipe(ttf2woff2())//ttf в woff2
        .pipe(gulp.dest(`${srcPath}/font/`))
}
//Генерируем font.css со всеми шрифтами из папки fonts
const fontsCSSGenerate = () => {
    return gulp.src(`${srcPath}/font/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`)
        .pipe(gulp.dest(`${srcPath}/font/`))
        .pipe(
            fontfacegen({
                filepath: `${srcPath}/css/`,
                filename: "font.scss",
            })
        )
}
const zipTask = () => {
    return gulp.src(`${buildPath}/**/*.*`)
        .pipe(zip('build.zip'))
        .pipe(gulp.dest(`./src/../../`))
}
//Синхронизация с браузером
const server = (done) => {
    browserSync.init({
        server: {
            baseDir: `${buildPath}/`
        },
        port: 3000
    })
}
const watcher = () => {
    gulp.watch(`${srcPath}/**/*.scss`, gulp.series(copy_css_to_build, scss));
    gulp.watch(`${srcPath}/**/*.js`, gulp.series(copy_js_to_build, js));
    gulp.watch(`${srcPath}/**/*.html`, gulp.series(copy_html_to_build, copy_version_to_build, html,));
    gulp.watch(`${srcPath}/images/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`, gulp.series(images, icons));
}
const copyTasks = gulp.parallel(copy_fonts_to_build, copy_js_to_build, copy_css_to_build, copy_html_to_build, copy_version_to_build);
const mainTasks = gulp.parallel(copyTasks, scss, js, html, images, icons);

gulp.task('default', gulp.series(clean_build, mainTasks, gulp.parallel(watcher, server)));
gulp.task('build', gulp.series(clean_build, mainTasks))
gulp.task('fonts', gulp.series(oftToTft, ttfToWoff, fontsCSSGenerate));
gulp.task('zip', gulp.series(zipTask));