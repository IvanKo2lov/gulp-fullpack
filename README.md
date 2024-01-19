Если у вас установлен git, то склонируйте репозиторий командой 
**git clone https://github.com/IvanKo2lov/gulp-fullpack.git**

Если не установлен то нажмите **зеленую кнопку code** и затем кнопку **download zip**

Затем необходимо в консоли убедитесь что вы находитесь в корневой папке где находится файл package.json

Если nodejs не установлен, то необходимо установить с оф. сайта https://nodejs.org/en

В консоли нужно вести команду npm install - подгрузятся все зависимости и плагины необходимые для сборки gulp.

По умолчанию настроены 5 команд:
**npm run fonts** - запустит процесс генерации шрифтов и создания font.scss файла
**npm run dev** - запуск режима разработки. Откроется вкладка в бразуере и будет работать синхронизация.
**npm run build** - создасть папку build с собранным проектом
**npm run icons** - сделает спрайт из svg иконок
**npm run zip** - заарзивирует папку build если она создана

Дополнительные плагины можно установить при необходимости.

https://www.npmjs.com/package/gulp-ssh SSH and SFTP

https://www.npmjs.com/package/gulp-htmlhint  - анализ html

https://www.npmjs.com/package/gulp-plumber - для работы с ошибками. Не прерывает процесс выполнения задач.

https://www.npmjs.com/package/gulp-notify - вывод сообщения в уведомления системы. Можно использовать с plumber

https://www.npmjs.com/package/gulp-pug - работа с pug шаблонами

https://www.npmjs.com/package/gulp-filter - плагин для фильтрации потока файлов

https://www.npmjs.com/package/gulp-babel -  конвертация современого js в старый js
