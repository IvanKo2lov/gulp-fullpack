import {isWebp} from './libs/webp.js';

document.addEventListener('DOMContentLoaded', function () {
    isWebp(document.body);
    const mobile_width = 991;
    let is_mobile = (window.innerWidth < mobile_width) ? true : false;
    window.onresize = function () {
        if (window.innerWidth >= mobile_width && is_mobile) {
            location.reload();
        }
        if (window.innerWidth < mobile_width && !is_mobile) {
            location.reload();
        }
    };

    //Ссылки не переходить по пустым ссылка с #
    for (let elem of document.querySelectorAll('a')) {
        if (elem.getAttribute("href") === '#') {
            elem.addEventListener('click', function (e) {
                e.preventDefault();

            });
        }
    }
})
