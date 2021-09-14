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
export default calc;