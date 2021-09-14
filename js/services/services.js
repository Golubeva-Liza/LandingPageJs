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

export {postData};
export {getResourse};