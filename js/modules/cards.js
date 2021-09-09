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