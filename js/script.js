//npx json-server db.json
//npx webpack
import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import {openModal} from './modules/modal';


document.addEventListener('DOMContentLoaded', () => {
    // CommonJs
    // const calc = require('./modules/calc'),
    //       cards = require('./modules/cards'),
    //       forms = require('./modules/forms'),
    //       modal = require('./modules/modal'),
    //       slider = require('./modules/slider'),
    //       tabs = require('./modules/tabs'),
    //       timer = require('./modules/timer');

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 8000);
    
    calc();
    cards();
    forms('form', modalTimerId);
    modal('[data-modal]', '.modal', modalTimerId);
    slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        slide: '.offer__slide',
        totalCounter: 'total',
        currentCounter: 'current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });//записать можно в любом порядке
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timer('.timer', '2021-10-22');
});

