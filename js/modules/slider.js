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