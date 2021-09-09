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