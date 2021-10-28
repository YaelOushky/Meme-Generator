'use strict'

var elGallery = document.querySelector('.main-container-image')
var elEditor = document.querySelector('.main-container-editor')
var elAbout = document.querySelector('.main-card')
var elSearchBar = document.querySelector('.search-bar')
// var elMemes = document.querySelector('')

var gCanvas
var gCtx
var gLocalImg
var gIsLocalImg = false

function init() {
    renderImgs()
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d');
    gCanvas.width = 500;
    gCanvas.hight = 500;
    resizeCanvas()
    onPage('Gallery')
}

function onPage(page) {
    switch (page) {
        case 'Gallery':
            elGallery.style.display = 'grid'
            elSearchBar.style.display = 'flex'
            elEditor.style.display = 'none'
            elAbout.style.display = 'none'
            // elMemes.style.display = 'none'
            // document.querySelector('.menu-open').style.display ='none'
            break;
        case 'Memes':
            elSearchBar.style.display = 'none'
            elGallery.style.display = 'none'
            elEditor.style.display = 'none'
            elAbout.style.display = 'none'
            // elMemes.style.display = 'block'
            break;
        case 'About':
            elSearchBar.style.display = 'none'
            elGallery.style.display = 'none'
            elEditor.style.display = 'none'
            elAbout.style.display = 'block'
            // elMemes.style.display = 'none'
            break;
    }
}

function onSetLang(lang){
    setLang(lang);
    var elBody = document.querySelector('body')
    if (lang === 'he') {
        elBody.classList.add('rtl')
    } else {
        elBody.classList.remove('rtl')
    }
    doTrans()
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onChooseStickers(sticker){
//     addLine(sticker);
//   onDisplayMemeImg(getCurrImgId());
//   _showSelectedLine();
//     // chooseStickers()
}

function onChangeColorFill(color) {
    return changeColorFill(color)
}
function onChangeColorBorder(color) {
    return changeColorBorder(color)
}

function onGetMemeUrl(id) {
    return getMemeImg(id).url;
}

function onGetMemeText(lineIdx) {
    return getMemeText(lineIdx);
}

function onChangeText(text) {
    changeText(text)
    onDisplayMemeImg(getCurrImgId())
}

function onChangeFontPos(pos) {
    fontPos(pos)
    onDisplayMemeImg(getCurrImgId());
}
function onDeleteLine(){
    deleteLine()
    onDisplayMemeImg(getCurrImgId());
}

function onAddLine(){
addLine('NEW LINE')
onDisplayMemeImg(getCurrImgId());
}

function onSetCurrImg(imgId) {
    clearCanvas()
    setSelectedImage(+imgId)
    onDisplayMemeImg(getCurrImgId());
    elEditor.style.display = 'flex'
    elGallery.style.display = 'none'
    elSearchBar.style.display = 'none'
    uploadImg()
}

function onChangeFont(fontName) {
    changeFont(fontName)
    onDisplayMemeImg(getCurrImgId())
}

function onIncreaseFont() {
    increaseFont()
    onDisplayMemeImg(getCurrImgId())
}

function onDecreaseFont() {
    decreaseFont()
    onDisplayMemeImg(getCurrImgId())
}

function onSwitchLine() {
    switchLine();
    onDisplayMemeImg(getCurrImgId());
    _showSelectedLine();
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
    gIsLocalImg = true
    onDisplayMemeImg(getCurrImgId())
}

function onDisplayMemeImg(id) {
    var memeImg = new Image();
    memeImg.src = onGetMemeUrl(id);
    memeImg.onload = function () {
        if (gIsLocalImg)memeImg = gLocalImg
        gCtx.drawImage(memeImg, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    };
}

function _showSelectedLine() {
    var lineNum = getSelectedLine();
    // document.querySelector('.line-num').innerText = ++lineNum;
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        gLocalImg = new Image();
        gLocalImg.onload = onImageReady.bind(null, gLocalImg)
        gLocalImg.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0])
}



function renderImgs(imgs = gImgs) {
    var strHTML = ''
    imgs.forEach(img => {
        strHTML += `
    <img src="${img.url}" id="${img.id}" class="card-image" onclick="onSetCurrImg(this.id)" />`
    })
    var elImgContainer = document.querySelector('.main-container-image')
    elImgContainer.innerHTML = strHTML
   
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

