const DELAY = 500; // задержка анимации в милисекундах (не менее 400мс, т.к. столько задано в css)
const HIDDENSTYLE = 'height: 0px; padding-bottom: 0; padding-top: 0;'; // стилевые свойства скрытия всего содержимого элемента списка
const HIDDENPADDING = 'padding-bottom: 0; padding-top: 0;'; // стилевые свойства скрытия паддингов отдельного элемента списка
const SHOWENPADDING = 'padding-bottom: 12px; padding-top: 12px;'; // стилевые свойства показа паддингов отдельного элемента списка
const accordion = document.querySelector('.accordion'); // найдем аккордион в DOM-дереве

const accordionItemsArr = accordion.childNodes[0].childNodes; // найдем элементы списка аккордиона в DOM-дереве
let heightsThemes = []; // массив высот каждого блока с темами всех элементов аккордиона
// заполним массив высот heightsThemes
accordionItemsArr.forEach( item => {
    const theme = item.querySelector('.accordion__themes')
    heightsThemes.push(theme.clientHeight);
});
// скроем все элементы списка, у которых нет класса is_active
accordionItemsArr.forEach( item => {
    const theme = item.querySelector('.accordion__themes');    
    if (!item.classList.contains('is_active')) theme.style = HIDDENSTYLE;
});

let isAnimate = false; // флаг разрешения анимации

// --------------------------------------------------
// функция анимации уменьшения высоты блока с темами
// --------------------------------------------------
const heightDown = (elementBlockThemes) => {
    let timerId = null; // идентификатор интервального таймера
    let currentHeight = parseInt(getComputedStyle(elementBlockThemes).height); // определим текущую высоту блока с темами
    const step = Math.round(DELAY / currentHeight ); // вычислим шаг относительно общей задержки и высоты блока с темами

    elementBlockThemes.style = HIDDENPADDING; // скрыть паддинги

    // создадим промис для анимации уменьшения высоты
    const p = new Promise( (resolve, reject) => {
        // создадим интервальный таймер
        timerId = setInterval( () => {
            // вычислим текущую высоту блока с темами
            currentHeight--;
            // если блок с тмами скрыт - остановить анимацию
            if (currentHeight <= 0) resolve();
            else elementBlockThemes.style.height = `${currentHeight}px`;
        }, step);                
    }).then( () => {
        clearInterval(timerId); // очистим идентификатор таймера и остановим сам таймер
        isAnimate = false; // анимация завершена
    });
}

// --------------------------------------------------
// функция анимации увеличения высоты блока с темами
// --------------------------------------------------
const heightUp = (elementBlockThemes, itemIndex) => {
    let timerId = null; // идентификатор интервального таймера
    let currentHeight = 0;
    const step = Math.round(DELAY / heightsThemes[itemIndex]); // вычислим шаг относительно общей задержки и высоты блока с темами

    elementBlockThemes.style = SHOWENPADDING; // показать паддинги

    // создадим промис для анимации увеличения высоты
    const p = new Promise( (resolve, reject) => {
        // создадим интервальный таймер
        timerId = setInterval( () => {
            // вычислим текущую высоту блока с темами
            currentHeight++;
            // если блок с тмами скрыт - остановить анимацию
            if (currentHeight >= heightsThemes[itemIndex]) resolve();
            else elementBlockThemes.style.height = `${currentHeight}px`;
        }, step);                
    }).then( () => {
        clearInterval(timerId); // очистим идентификатор таймера и остановим сам таймер
        isAnimate = false; // анимация завершена
    });
}

// ---------------------
// MAIN-обработчик
// ---------------------
const handler = (e) => {
    const target = e.target || e.srcElement; // найдем элемент, по которому совершили клик/тап
    let accordionTitle = null; // блок с заголовками тем  
    
    // определим объект-заголовок элемента аккордиона 
    if (target.classList.contains('accordion__title')) accordionTitle = target; 
    else accordionTitle = target.parentNode; // иначе, проверим родителя
    
    // определим номер элемента аккордиона, по которому кликнули
    let currentItem = -1;
    accordionItemsArr.forEach( item => {
        const dataItemIndex = item.dataset.index;
        const dataTargetIndex = accordionTitle.parentNode.dataset.index;
        if (dataItemIndex === dataTargetIndex) currentItem = dataTargetIndex;  
    });
    
    // если объект-заголовок нашелся
    if (accordionTitle.classList.contains('accordion__title') && !isAnimate) {
        isAnimate = true; // разрешаем анимацию
        
        const accordionItem = accordionTitle.parentNode; // находим сам родитель - элемент аккордиона
        const accordionThemes = accordionTitle.nextSibling; // находим соседний элемент - список тем

        // если щелкнули по элементу, у которого имеется класс is_active
        if (accordionItem.classList.contains('is_active')) {
            accordionItem.classList.remove('is_active'); // удалить класс is_active  
            heightDown(accordionThemes);

        } else { // если щелкнули по элементу, у которого нет класса is_active

            // инициализируем переменные: текущий активный элемент аккордиона (у которого есть класс is_active) и номер этого элемента аккордиона
            let currentItemisActive = null, currentActiveItem = -1;
            // определим вышеинициализированные переменные
            accordionItemsArr.forEach( (item, index) => {
                if (item.classList.contains('is_active')) {
                    currentItemisActive = item;
                    currentActiveItem = index;
                }
            });            

            if (currentActiveItem >= 0) { // если имеется активный элемент в аккордионе
                currentItemisActive.classList.remove('is_active'); // удалить класс is_active
                heightDown(currentItemisActive.querySelector('.accordion__themes'));
            }
            
            accordionItem.classList.add('is_active'); // добавить класс is_active
            heightUp(accordionThemes, currentItem);
        }
    }    
}

accordion.addEventListener('click', e => handler(e)); // ЛКМ
