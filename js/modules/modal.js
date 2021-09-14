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
export default modal;
export {closeModal};
export {openModal};