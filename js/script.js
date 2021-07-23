
document.addEventListener('DOMContentLoaded', () => {

    // TABS
    const tabs = document.querySelectorAll('.tabheader__item'),//получили все div стили питания
          tabsContent = document.querySelectorAll('.tabcontent') ,//получили контейнеры-слайды
          tabsParent = document.querySelector('.tabheader__items');//получили родителя tabs для делегирования событий


    function hideTabContent(){//скрыла весь контент
        tabsContent.forEach(item =>{
            //item.style.display = 'none';// НО! лучше делать не через inline style, а добавлять и удалять классы
            item.classList.add('hide');
            item.classList.remove('show', 'animation');//убираем анимацию, чтобы она потом снова воспроизвелась (хотя и так работает)
        });
        tabs.forEach(tab =>{//уюираем класс активности у табов справа
            tab.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent(i = 0){//см ниже, аргумент по умолчанию. если при вызове есть аргмуент, не учитывается
        //tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('show', 'animation');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }


    hideTabContent();
    showTabContent();
    //если функция вызовется без аргумента, то в функции можно написать аргумент по умолчанию (i = 0)


    tabsParent.addEventListener('click', (event) => {
        const target = event.target;//сокращение просто

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





    // TIMER

    const deadline = '2021-07-24';

    //функция, определяющая разницу между дедлайном и текущем временем
    function getTimeRemaining(endtime){

        const t = Date.parse(endtime) - Date.parse(new Date());
        //количество миллисекунд в конечном времени, до которого нужно досчитать
        //parse возвращает количество миллисекунд, прошедших с 1 января 1970 года 00:00:00 по UTC.
        
        //теперь надо эти миллисекунды нужно превратить в часы, минуты и тп
        const days = Math.floor(t / 86400000);//округление до ближайшего меньшего целого.
        //число в знаменателе - 1000 * 60 * 60 * 24

        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        //t делим на количество часов. но часов там может быть и 150 и тп.
        //% делит на 24 и возвращает остаток от деления (то, что не хватает до полный суток)
        
        const minutes = Math.floor((t / (1000 * 60)) % 60);//хвостик от минут в часах
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
            return `0${num}`;//только уже строчка, но не важно
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
              timeInterval = setInterval(updateClock, 1000);//каждую секунду

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






    // MODAL WINDOW

    //для того, чтобы обратиться к элементу-триггеру модального окна, можно использовать не класс и тег, а data-атрибуты,
    //тк как теги так и классы могут меняться

    const modalOpen = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');
    
    //для одной кнопки
    // modalOpen.addEventListener('click', () => {
    //     modal.classList.add('show');
    //     modal.classList.remove('hide');
    //     document.body.style.overflow = 'hidden';
    // });

    
    //открываем модальное окно
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


    // modalClose.addEventListener('click', () => {
    //     modal.classList.remove('show');
    //     modal.classList.add('hide');
    //     document.body.style.overflow = '';
    // });


    //переделаем в функцию, тк закрытие встречается несколько раз
    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    // modalClose.addEventListener('click', closeModal);//здесь не нужно объявление


    //закрытие по темному полю в пределах модального окна
    modal.addEventListener('click', (e) =>{
        //обязательно е в скобках
        // console.log(e.target);

        //если нажимаем на подложку или на любой крестик (делегирование события крестика)
        if (e.target === modal || e.target.getAttribute('data-close') == ''){
            //проверяет нажатие по тегу с классом modal, а если нажать модальное окно, то выведет
            // уже другой тег с классом. нажимаю на input - выведет input, а темное поле - только диф с классом modal
            // modal.classList.remove('show');
            // modal.classList.add('hide');
            // document.body.style.overflow = '';
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

    //гуглить event.code




    //модальное окно всплывает через время, при этом если пользователь сам нажал
    //на модальное окно, то оно не всплывает

    // setTimeout позволяет вызвать функцию ОДИН раз через определённый интервал времени.
    // setInterval позволяет вызывать функцию РЕГУЛЯРНО, повторяя вызов через определённый интервал времени.
    const modalTimerId = setTimeout(openModal, 8000);



    //открывается модальное окно, когда долистали страницу до конца
    //событие scroll на глобальном объекте window

    //pageYOfset - сколько пикселей отлисталось сверху
    //scrollheight - вся высота контента
    //сколько отлисталось + высота окна клиента = вся высота контента => пользователь
    //долистал до конца.

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
    //}, {once: true}); //есть такое действие, но в данном случае не сработает
    //тк сработает 1 раз, когда хоть немного пролистнем











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
            this.transfer = 74;//курс валют (в данном случае доллары в рубли). можно и как аргументом в будущем
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

            // this.classes = classes || 'menu__item'; 
            //1) classes пустой - будет пустой массив, что все равно true
            //2) строку menu__item мы прогоним через forEach = ошибка

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
            console.log(this.parent);
        }
    }

    //могли бы сделать
    // const divCard = new MenuCards();//+ аргументы
    // divCard.writeHtml();

    //но есть способ проще. можно не создавать переменную и её вызывать. можно сразу создать объект, сделать операцию
    // и он сразу удалится. мы нигде его больше не сможем вызвать
    new MenuCards(
        "img/tabs/vegy.jpg", //лучше передавать в кавычках, чем ставить их в интерполяции
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        7,
        '.menu .container'
        // 'menu__item',//класс без . перед, тк добавляется в classlist
        // 'big',//еще какой то класс
        // 'red'
    ).writeHtml();

    //мы вызываем 3 одинаковые структуры. хорошо было бы засунуть их в цикл, но мы не можем пока брать данные с серва

    new MenuCards(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        12,
        '.menu .container'
    ).writeHtml();

    new MenuCards(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        17,
        '.menu .container'
    ).writeHtml();






    
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
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();//убираем перезагрузку сервера при отправке формы
            //console.log(e);//событие SubmitEvent

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
            
            //для JSON нужен заголовок
            // request.setRequestHeader('Content-type', 'application/json');

            const formData = new FormData(form);//передаетя форма из арг функции
            //!в input необходимо всегда указывать атрибут name, иначе formdata не сможем работать

            //1) отправим Formdata
            fetch('server1.php', {
                method: "POST",
                body: formData //что именно отправляем
            })
            .then(data => data.text())
            .then(data => {
                console.log(data);//data - данные, которые вернул сервер (промис)
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();//сброс формы после отправки
            });

            //2) отправляем в формате json
            // перевод formdata в json
            // const object = {};
            // formData.forEach(function(value, key){
            //     object[key] = value;
            // });


            // fetch('server.php', {
            //     method: "POST",
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object) 
            // })
            // .then(data => data.text())
            // .then(data => {
            //     console.log(data);
            //     showThanksModal(message.success);
            //     statusMessage.remove();
            // })
            // .catch(() => {
            //     showThanksModal(message.failure);
            // })
            // .finally(() => {
            //     form.reset();
            // });


            //при отработке блока catch в модальном окне ничего не поменялось
            //промис, запущенный fetch не перейдет в состояние rejected из-за ответа http 400-500 ошибки
            //там только статус поменяется 
            //для fetch важно, что он смог сделать запрос, поэтому он не обратит внимания на ошибки http
            //вот если мы без инета запрос сделаем, тогда сработает catch
        }); 
    }

    //очистить кэш - shift + F5
    // в нетворк сверху можно выбрать скорость инета (slow 3G). тогда увидим сообщение о загрузке


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







    // FETCH API
    //встроена в браузер, чтобы общаться с сервером

    //в скобках - запрос на url, если нет других параметров - get запрос
    //возвращается промис
    // fetch();
    // fetch('https://jsonplaceholder.typicode.com/todos/1')

    //много свойств, важные - метод и бади
    //отправляем пост запрос
    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: "POST",
    //     body: JSON.stringify({name: 'Alex'}),//отправляем в формате json
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // })
    // .then(response => response.json())//респонсе в формате json
    // //метод response.json() превратит данные из json в объект на js
    // //но возвращается промис
    // //response.text()
    // .then(json => console.log(json)); 
    // //вывел {name: "Alex", id: 101}, где id - номер записи, на сайте указано, что там было их 100
    // //значит код правильно отработал и мы добавили новую запись

});