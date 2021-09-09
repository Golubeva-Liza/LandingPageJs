/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

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
module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

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

    getResourse('http://localhost:3000/menu')//придет массив с объектами карточек
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
module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms (){
        // FORMS

    // Взять несколько форм и отправлять форму на server.php
    // Чтобы не создавать 2 одинаковых обработчика, мы их запишем в функцию
    // которую будем вызывать при отправке формы
    
    const forms = document.querySelectorAll('form');

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
            postData('http://localhost:3000/requests', json)
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
        openModal();

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
            closeModal();
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
        }, 3000);
    }


    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));
}
module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal (){
    // MODAL WINDOW

    //для того, чтобы обратиться к элементу-триггеру модального окна, можно использовать не класс и тег, а data-атрибуты,

    const modalOpen = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');

    function openModal () {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';

        clearInterval(modalTimerId);
        //если пользователь сам открыл модальное окно до истечения времени
        //setTimeOut - сбрасывается интервал, второй раз его показывать не надо
    }

    //для многих кнопок modalOpen
    modalOpen.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    //переделаем в функцию, тк закрытие встречается несколько раз
    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }


    //закрытие по темному полю в пределах модального окна
    modal.addEventListener('click', (e) =>{
        //если нажимаем на подложку или на любой крестик (делегирование события крестика)
        if (e.target === modal || e.target.getAttribute('data-close') == ''){
            //проверяет нажатие по тегу с классом modal, а если нажать модальное окно, то выведет
            // уже другой тег с классом. нажимаю на input - выведет input, а темное поле - только диф с классом modal
            closeModal();
        }
    });


    //закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
        // console.log(e.code);
        //code передает код клафиши

        //проверяем, что модальное окно открыто: содержит класс show
        if(e.code === "Escape" && modal.classList.contains('show')){
            closeModal();
        }
    });



    // setTimeout позволяет вызвать функцию ОДИН раз через определённый интервал времени.
    // setInterval позволяет вызывать функцию РЕГУЛЯРНО, повторяя вызов через определённый интервал времени.
    const modalTimerId = setTimeout(openModal, 8000);



    //открывается модальное окно, когда долистали страницу до конца
    //событие scroll на глобальном объекте window

    const doc = document.documentElement;

    function showModalByScroll() {
        if (window.pageYOffset + doc.clientHeight >= doc.scrollHeight){
            openModal();
            //когда один раз мы долистали до конца и сработало условие, мы
            //показываем модальное окно и убираем обработчик события
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}
module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider (){
    // SLIDER
    const currSlide = document.getElementById('current'),
          slider = document.querySelector('.offer__slider'),
          totalSlide = document.getElementById('total'),
          slides = document.querySelectorAll('.offer__slide'),
          leftArrow = document.querySelector('.offer__slider-prev'),
          rightArrow = document.querySelector('.offer__slider-next'),

    //для второго
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
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
module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs () {
    // TABS
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent') ,
          tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent(){//скрыла весь контент
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'animation');
        });
        tabs.forEach(tab =>{
            tab.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent(i = 0){//см ниже, аргумент по умолчанию. если при вызове есть аргмуент, не учитывается
        tabsContent[i].classList.add('show', 'animation');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;//сокращение 

        if (target && target.classList.contains('tabheader__item')){
            console.log(target);
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
module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer (){
// TIMER

    const deadline = '2021-08-24';

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

    setClock('.timer', deadline);

}
module.exports = timer;

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
//npx json-server db.json

document.addEventListener('DOMContentLoaded', () => {
    const calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
    
    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});

//npx webpack
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map