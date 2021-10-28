'use strict'

var gCurrLang = 'en';

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    console.log(els);
    els.forEach((el) => {
        var elTrans = el.dataset.trans
        if (el.nodeName === 'INPUT') {
            el.placeholder = getTrans(elTrans)
        } else {
            el.innerText = getTrans(elTrans)
        }
    })

}

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    // if (!keyTrans) return 'UNKNOWN';
    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en;
    return txt;
}

function setLang(lang) {
    console.log(lang);
    gCurrLang = lang;
}

function getLang() {
    return gCurrLang
}

var gTrans = {
    Gallery: {
        en: 'Gallery',
        he: 'גלריה'
    },
    Memes: {
        en: 'Memes',
        he: 'ממים שמורים'
    },
    About: {
        en: 'About',
        he: 'בואו נכיר'
    },
    Hebrew: {
        en: 'Hebrew',
        he: 'עברית'
    },
    English: {
        en: 'English',
        he: 'אנגלית'
    },
    keyword: {
        en: 'Enter search keyword',
        he: 'הכנס מילת חיפוש'
    },
    allrights: {
        en: 'all rights reserved 2021',
        he: 'כל הזכויות שמורות 2021'
    },
    download: {
        en: 'download',
        he: 'הורדה'
    },
    save: {
        en: 'save',
        he: 'שמירה'
    },
    uploadImg: {
        en: 'Upload image',
        he: 'העלה תמונה'
    },
}