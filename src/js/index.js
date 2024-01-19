import {isWebp} from './libs/webp.js';

document.addEventListener('DOMContentLoaded', function () {
    isWebp(document.body);
    const mobile_width = 991;
    let is_mobile = (window.innerWidth < mobile_width) ? true : false;
    const one_px_to_vw = is_mobile ? parseFloat(1 / (320 / 100)) : parseFloat(1 / (1440 / 100));
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
