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