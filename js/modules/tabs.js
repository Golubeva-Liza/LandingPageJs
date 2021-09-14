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
export default tabs;