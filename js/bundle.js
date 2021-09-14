/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calc (){
        // КАЛЬКУЛЯТОР

    // Формула расчета базовой нормы калорий:
    // для мужчин: BMR = 88.36 + (13.4 x вес, кг) + (4.8 х рост, см) – (5.7 х возраст, лет)
    // для женщин: BMR = 447.6 + (9.2 x вес, кг) + (3.1 х рост, cм) – (4.3 х возраст, лет)

    // в качестве data-attribute вносим инфу про коэффициенты активности (html)


    const calcResult = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;


    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female'; //значение по умолчанию, чтоб работала формула
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375; //значение по умолчанию, чтоб работала формула
        localStorage.setItem('ratio', 1.375);
    }


    //функция, которая сработает 1 раз, чтобы установить классы активности в соответствии с localStorage
    function initLocalSettings(parentSelector, activeClass){
        const elements = document.querySelectorAll(`${parentSelector} div`);
        console.log(elements);
        elements.forEach(elem => {
            console.log(elem);
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    }
    initLocalSettings('#gender', 'calculating__choose-item_active');
    initLocalSettings('#activity', 'calculating__choose-item_active');


    //расчёт калорий
    function calcСalories(){
        if (!sex || !height || !weight || !age || !ratio){
            calcResult.textContent = '____';
            return;//дальше программа функции идти не будет
        } 

        if (sex === 'female'){
            calcResult.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            calcResult.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcСalories();

    function getStaticInfo(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        //объединяем функцию для выбора пола и выбора активности и проверяем условием
        //начилие id в первом случае и атрибута во втором
        elements.forEach(elem => {
            elem.addEventListener('click', (e) =>{
                if (e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');

                    //хотим запомнить что он выбрал, чтобы сохранить и отобразить в след раз
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
    
                calcСalories();
            });
        });
    }
    
    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('#activity', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            //если нашли что-то кроме цифры
            if (input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            } else{
                input.style.border = 'none';
            }
            //можно добавить подсказку, надпись, алгоритм один и тот же
            //ну или просто запретить ему вводить нецифры? 

            switch(input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
                //если введена не цифра, то превращается в NaN, что в логик контексте false
            }
            calcСalories();
        });
        
    }
    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
}
// module.exports = calc; //commonjs
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function cards (){
// ИСПОЛЬЗОВАНИЕ КЛАССОВ, ШАБЛОНИЗАЦИЯ КАРТОЧЕК
    
    class MenuCards {
        //alt - что подставить вместо картинки, если не загрузилась
        //parent - родительский div (селектор), в который мы будем вставлять карточку
        //rest параметр не содержит default значение
        constructor (picture, alt, h3, describ, price, parentSelector, ...classes){
            this.picture = picture;
            this.alt = alt;
            this.title = h3;
            this.describ = describ;
            this.price = price;
            this.classes = classes;//массив
            this.parent = document.querySelector(parentSelector);//родитель один
            this.transfer = 74;//курс валют (в данном случае доллары в рубли)
            this.changeToRub();//тут же вызываем, значение this.price перезапшется (см функцию)
        }

        //метод перевода долларов в рубли
        changeToRub(){
            this.price = this.price * this.transfer;
        }

        //классическое название для верстки - render()
        writeHtml (){
            //создаем карточку
            const element = document.createElement('div');

            //через условие проверим пустоту массива и тогда присвоим значение по умолчанию
            //массив проверять через length
            if(this.classes.length == 0){
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            } else{
                this.classes.forEach(className => {element.classList.add(className);});
                //в classes мы передаем все классы, которые хотим присвоить карточке. их может быть несколько, 
                //для кастомизации, поэтому мы добавляем в созданный div все классы, передающиеся в массив rest оператором
            }

            element.innerHTML= `
                <img src=${this.picture} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.describ}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }


    (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResourse)('http://localhost:3000/menu')//придет массив с объектами карточек
        .then(data => {
            //сколько будет карточек на сервере - столько раз их создаст
            data.forEach(({img, altimg, title, descr, price}) => {
                //разбили объект в свойства
                // new MenuCards(obj.img, obj.altimg, obj.title ).writeHtml();
                //не оч хорошо, когда мы перебираем свойства. используем деструктуризацию объетка
                //вытаскиваем отдельные свойства в отдельную переменную

                new MenuCards(img, altimg, title, descr, price, '.menu .container').writeHtml();
            });
        });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function forms (formSelector, modalTimerId){
        // FORMS

    // Взять несколько форм и отправлять форму на server.php
    // Чтобы не создавать 2 одинаковых обработчика, мы их запишем в функцию
    // которую будем вызывать при отправке формы
    
    const forms = document.querySelectorAll(formSelector);

    //список фраз при отправке формы
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    //функция которая создается в потоке кода
    //лучше выносить общение с сервером в отдельную функцию, тк разные формы, например,
    //могут отправляться на разные сервера
    


    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();//убираем перезагрузку сервера при отправке формы
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.append(statusMessage);
            //если хотим добавить ПОСЛЕ в форму, а не внутри неё в конец
            //первый аргумент - куда, второй - что
            form.insertAdjacentElement('afterend', statusMessage);


            //formdata - спец объект, который позволяет с формы формировать
            //данные в формате ключ-значение

            const formData = new FormData(form);//передаетя форма из арг функции
            //!в input необходимо всегда указывать атрибут name, иначе formdata не сможем работать

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // const obj2 = {a: 23, B: 50};
            // console.log(Object.entries(obj2));
            //метод берет объект, превращает его в массив, внутри которого массивы из двух элементов ключ-значение
            //[ [ 'a', 23 ], [ 'B', 50 ] ] - матрица



            //отправим Formdata
            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);//data - данные, которые вернул сервер (промис)
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        }); 
    }

    //очистить кэш - shift + F5

    //после отправки формы, всплывает окно с "Спасибо!"

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        prevModalDialog.classList.add('hide');
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        //спустя время модальное окно исчезает, форма возвращается
        setTimeout(() => {
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
        }, 3000);
    }


    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
function openModal (modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    if (modalTimerId){
        clearInterval(modalTimerId);
    }
    
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.remove('show');
    modal.classList.add('hide');
    document.body.style.overflow = '';
}
//тк эти функции нужны в другом модуле, выносим в отдельные функции
//модуль может быть вызван для разных переменных. от одной сущности они зависеть не должны



function modal(triggerButton, modalSelector, modalTimerId){
    //значения аргументов подставляем в файле script.js 

    const modalOpen = document.querySelectorAll(triggerButton);
    const modal = document.querySelector(modalSelector);

    //для многих кнопок modalOpen
    modalOpen.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));

        //btn.addEventListener('click', openModal(modalSelector));
        //так нельзя писать, тк мы в данном случае вызываем функцию, а надо её просто указать,
        //тк она должна выполниться строго после клика, а так она запустится сразу.
    });


    //закрытие по темному полю в пределах модального окна
    modal.addEventListener('click', (e) =>{
        //если нажимаем на подложку или на любой крестик (делегирование события крестика)
        if (e.target === modal || e.target.getAttribute('data-close') == ''){
            //проверяет нажатие по тегу с классом modal, а если нажать модальное окно, то выведет
            // уже другой тег с классом. нажимаю на input - выведет input, а темное поле - только диф с классом modal
            closeModal(modalSelector);
        }
    });


    //закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
        // console.log(e.code);
        //code передает код клафиши

        //проверяем, что модальное окно открыто: содержит класс show
        if(e.code === "Escape" && modal.classList.contains('show')){
            closeModal(modalSelector);
        }
    });



    // setTimeout позволяет вызвать функцию ОДИН раз через определённый интервал времени.
    // setInterval позволяет вызывать функцию РЕГУЛЯРНО, повторяя вызов через определённый интервал времени.
    // const modalTimerId = setTimeout(openModal, 8000);
    //переносим эту переменную в скрипт.js, тк он используется в нескольких модулях.



    //открывается модальное окно, когда долистали страницу до конца
    //событие scroll на глобальном объекте window

    const doc = document.documentElement;

    function showModalByScroll() {
        if (window.pageYOffset + doc.clientHeight >= doc.scrollHeight){
            openModal(modalSelector, modalTimerId);
            //когда один раз мы долистали до конца и сработало условие, мы
            //показываем модальное окно и убираем обработчик события
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function slider ({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}){
    // используем деструктуризацию в аргументе функции

    const currSlide = document.getElementById(currentCounter),
          slider = document.querySelector(container),
          totalSlide = document.getElementById(totalCounter),
          slides = document.querySelectorAll(slide),
          leftArrow = document.querySelector(prevArrow),
          rightArrow = document.querySelector(nextArrow),

    //для второго
          slidesWrapper = document.querySelector(wrapper),
          slidesField = document.querySelector(field),
          widthSlide = window.getComputedStyle(slidesWrapper).width;
    //мы не можем вытащить значение ширины элемента с помощью style.width, тк это inline style, которого у элемента нет
    //computedstyle - это то, что мы можем увидеть в панели разработчика

    let id = 0;//можно было и id = 1
    let offset = 0;//отступ

    // Добавление навигации по слайдам
    const indicators = document.createElement('ol'),
    dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        //через атрибуты
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    //второй вариант (как slickslider, когда это карусель и слайды выстраиваются в ряд, но скрыты)
    //сначала добавляем ещё одну обертку для слайдов - offer__slider-inner
    //wrapper - "окно" со свойством overlow: hidden, a inner - блок со слайдами, ширина которого будет сумма всех слайдов
    //поэтому мы будем передвигать слайды, а не показывать

    if (slides.length < 10){
        totalSlide.innerHTML = `0${slides.length}`;
    } else {
        totalSlide.innerHTML = slides.length;
    }

    slidesField.style.width = 100 * slides.length + '%';//так прописываем процент, потому что это единица измерения для css
    //количество процентов относительно родителя => в slides.length раз больше чем родитель
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s all";
    slidesWrapper.style.overflow = "hidden";

    slides.forEach(slide =>{
        slide.style.width = widthSlide;
    });

    // let widthNumber = +widthSlide.slice(0, widthSlide.length - 2);//width="500px" убираем px
    //с помощью регулярного выражения
    // let widthNumber = +widthSlide.replace(/\D/g, '');//буквы просто удалятся, в тч всякие %, например

    //но лучше создать функцию, внутри которой передавать строку, в которой нужно избавиться от всех нечисел, чтобы это была не только width
    function transformStrToNum (str) {
        return +str.replace(/\D/g, '');
    }
    //вызываем её везде, где необходима трансформация значения ширины

    //обновляем номер слайда на странице и сдвигаем слайд
    const transformSlides = function(){
        if (id + 1 < 10){
            currSlide.innerHTML = `0${id + 1}`;
        } else {
            currSlide.innerHTML = id + 1;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
    };

    //показываем нужную точку после перелистывания слайда
    const showCurrDot = function(){
        dots.forEach(dot => {
            dot.style.opacity = 0.5;
        });
        dots[id].style.opacity = 1;
    };

    //нажали стрелку, проверяем граничные значения, меняем их, меняем инфу на странице
    rightArrow.addEventListener('click', () => {
        if(offset == transformStrToNum(widthSlide) * (slides.length-1)){ 
            offset = 0;
        }else{
            offset+= transformStrToNum(widthSlide);//+= то же самое что offset = offset + ...
        }

        if (id == slides.length - 1) {
            id = 0;
        }else{
            id++;
        }

        transformSlides();
        showCurrDot();
    });
    leftArrow.addEventListener('click', () => {
        if(offset == 0){ 
            offset = transformStrToNum(widthSlide) * (slides.length-1);
        }else{
            offset-= transformStrToNum(widthSlide);
        }

        if (id == 0) {
            id = slides.length - 1;
        }else{
            id--;
        }

        transformSlides();
        showCurrDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            id = slideTo - 1;
            offset = transformStrToNum(widthSlide) * (slideTo - 1);

            transformSlides();
            showCurrDot();
        });
    });


    //первый вариант (очевидный)
    //________________________________________________________
    // if (slides.length < 10){
    //     totalSlide.innerHTML = `0${slides.length}`;
    // } else {totalSlide.innerHTML = slides.length;}


    // function showSlide (id) {
    //     slides.forEach(item =>{
    //         item.classList.add('hide');
    //         item.classList.remove('show', 'animation');
    //     });//скрыли все

    //     //показали нужный
    //     slides[id].classList.add('show', 'animation');
    //     slides[id].classList.remove('hide');

    //     //вывели номер слайда
    //     if (id + 1 < 10) {
    //         currSlide.innerHTML = `0${id + 1}`;
    //     } else {currSlide.innerHTML = id + 1;}
    // }

    // showSlide(id);

    // rightArrow.addEventListener('click', (event) => {
    //     id++;
    //     if (id === slides.length) {
    //         id = 0;
    //     }
    //     showSlide(id);
    // });

    // leftArrow.addEventListener('click', (event) => {
    //     id--;
    //     if (id === -1) {
    //         id = slides.length - 1;
    //     }
    //     showSlide(id);
    // });
    //________________________________________________________
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs (tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // TABS
    const tabs = document.querySelectorAll(tabsSelector),
          tabsContent = document.querySelectorAll(tabsContentSelector) ,
          tabsParent = document.querySelector(tabsParentSelector);


    function hideTabContent(){//скрыла весь контент
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'animation');
        });
        tabs.forEach(tab =>{
            tab.classList.remove(activeClass);
        });
    }


    function showTabContent(i = 0){//см ниже, аргумент по умолчанию. если при вызове есть аргмуент, не учитывается
        tabsContent[i].classList.add('show', 'animation');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;//сокращение 

        if (target && target.classList.contains(tabsSelector.slice(1))){
            //если мы в аргументе функции (главной), передаем класс с точкой, а нам нужно его использовать
            // без точки, например, в classList.add, то модифицируем с помощью slice(1) - сформирует новую строку без первого символа

            //нужно узнать номер таба, на который нажали и отображать нужный контент
            tabs.forEach((item, i) => {//item = таб, i - номер
                if (target == item) {
                    hideTabContent();//скрываем то, что было до этого открыто
                    showTabContent(i);
                }
            });
        }
    });
}


//COMMON JS
// module.exports = tabs;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer (timerSelector, deadline){
// TIMER

    // const deadline = '2021-08-24'; // вынесли в script.js как аргумент

    //функция, определяющая разницу между дедлайном и текущем временем
    function getTimeRemaining(endtime){

        const t = Date.parse(endtime) - Date.parse(new Date());
        //количество миллисекунд в конечном времени, до которого нужно досчитать
        
        //теперь надо эти миллисекунды нужно превратить в часы, минуты и тп
        const days = Math.floor(t / 86400000);

        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        //% делит на 24 и возвращает остаток от деления (то, что не хватает до полных суток)
        
        const minutes = Math.floor((t / (1000 * 60)) % 60);
        const seconds = Math.floor((t / 1000) % 60);



        return{//создаем объект и сразу возвращаем
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    } 
    
    //функция добавления в день и часы 0 перед цифрой, если число меньше 10 (частое требование)
    function getZero(num){
        if (num >=0 && num<10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();//вручную вызываем функцию, тк из-за setInterval она сработает только через секунду

        //функция обновления таймера каждую секунду
        function updateClock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }

    setClock(timerSelector, deadline);

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postData": () => (/* binding */ postData),
/* harmony export */   "getResourse": () => (/* binding */ getResourse)
/* harmony export */ });
//выносим в отдельные файлы, тк это просто функция получения, она может использоваться неоднократно
const postData = async (url, data) => {
    //делаем запрос и можем сразу обработать

    //это асинхронный код, поэтому fetch может идти долго, поэтому в переменную ничего не помещается
    //механизм, превращающий асинхронный код в синхронный 
    //async (перед функцией, типо в функции есть синхронный код), await (используются в паре)

    const res = await fetch(url, {
        method: "POST",
        //но потом мы сделаеи, то в postdata передается аргумент, овтечающий за формат данных,
        //в зависимости от которого будет создаваться нужный заголовок
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });
    
    //перевод тоже может долго идти
    return await res.json();
};

//делает get запрос для формирования карточек
const getResourse = async (url) => {
    const res = await fetch(url);

    //fetch не выдаст catch из-за ошибки http-запроса, поэтому вручную исправляем это
    //свойства у промиса, возвращаемого из fetch - ok и status

    if (!res.ok) {
        //объект ошибки
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    
    //перевод тоже может долго идти
    return await res.json();//это промис
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
//npx json-server db.json
//npx webpack










document.addEventListener('DOMContentLoaded', () => {
    // CommonJs
    // const calc = require('./modules/calc'),
    //       cards = require('./modules/cards'),
    //       forms = require('./modules/forms'),
    //       modal = require('./modules/modal'),
    //       slider = require('./modules/slider'),
    //       tabs = require('./modules/tabs'),
    //       timer = require('./modules/timer');

    const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__.openModal)('.modal', modalTimerId), 8000);
    
    (0,_modules_calc__WEBPACK_IMPORTED_MODULE_0__["default"])();
    (0,_modules_cards__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_modules_forms__WEBPACK_IMPORTED_MODULE_2__["default"])('form', modalTimerId);
    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__["default"])('[data-modal]', '.modal', modalTimerId);
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_4__["default"])({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        slide: '.offer__slide',
        totalCounter: 'total',
        currentCounter: 'current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });//записать можно в любом порядке
    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_5__["default"])('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_6__["default"])('.timer', '2021-10-22');
});


})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map