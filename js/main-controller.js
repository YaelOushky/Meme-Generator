'use strict'

var elGallery = document.querySelector('.main-container-image')
var elEditor = document.querySelector('.main-container-editor')
var elAbout = document.querySelector('.main-card')
var elSearchBar = document.querySelector('.search-bar')
// var elMemes = document.querySelector('')

var gCurrPosX
var gCurrPosY
var gCanvas
var gCtx
var gLocalImg
var gStartPos
var gDragOn = false
var gFocustxt = true
var gNoFocus = false
var gFocusSticker = false
var gIsLocalImg = false
var gIsDraw = false
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
    renderImgs()
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d');
    // gCanvas.width = 500;
    // gCanvas.height = 500;
    resizeCanvas()
    onPage('Gallery')
    addDragDrop()
    // addListeners()
    // onDisplayMemeImg(getCurrImgId())

}

function moveText(ev) {

    if (gDragOn) {

        ev.preventDefault()
        ev.stopPropagation()

        var offsetX
        var offsetY
        if (ev.type === 'touchmove') {
            offsetX = ev.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left
            offsetY = ev.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top
        } else {
            offsetX = ev.offsetX
            offsetY = ev.offsetY
        }

        var disX = offsetX - gCurrPosX;
        var disY = offsetY - gCurrPosY;

        var meme = getMeme()

        if (gFocustxt) {
            var lines = meme.lines
            lines.forEach(function (line) {
                if (line.isDragging) {
                    changePositionX(disX)
                    changePositionY(disY)
                }
            })
        }

        if (gFocusSticker) {
            var stickers = meme.stickers
            stickers.forEach(function (sticker) {
                if (sticker.isDragging) {
                    changePositionX(disX)
                    changePositionY(disY)
                }
            })
        }


        onDisplayMemeImg(getCurrImgId())

        gCurrPosX = offsetX;
        gCurrPosY = offsetY;
    }
}

function dragText(ev) {

    ev.preventDefault()
    ev.stopPropagation()

    var offsetX
    var offsetY
    if (ev.type === 'touchstart') {
        offsetX = ev.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left
        offsetY = ev.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top
    } else {
        offsetX = ev.offsetX
        offsetY = ev.offsetY
    }

    var meme = getMeme()
    var lines = meme.lines
    var idx = 0
    lines.forEach(function (line) {
        if (offsetX > line.pos.x - 160 &&
            offsetX < line.pos.x + 160 &&
            offsetY > line.pos.y  - 40 &&
            offsetY < line.pos.y  + 10) {
            switchLinesDrogDrop(idx)
            updateDragging(idx, 'lines', true)
            document.querySelector('.control-txt-input').value = line.txt
            onDisplayMemeImg(getCurrImgId())
            gDragOn = true
            gFocustxt = true
            gFocusSticker = false
            return
        }
        idx++
    })
    // var stickers = meme.stickers
    // var idx = 0
    // stickers.forEach(function (sticker) {
    //     if (offsetX > sticker.pos.x  - 10 &&
    //         offsetX < sticker.pos.x  + sticker.width + 10 &&
    //         offsetY > sticker.pos.y  - 10 &&
    //         offsetY < sticker.pos.y  + sticker.height + 10) {
    //         switchStickersDrogDrop(idx)
    //         updateDragging(idx, 'stickers', true)
    //         onDisplayMemeImg(getCurrImgId())
    //         gDragOn = true
    //         gFocusSticker = true
    //         gFocustxt = false
    //         return
    //     }
    //     idx++
    // })


    gCurrPosX = offsetX
    gCurrPosY = offsetY
    onDisplayMemeImg(getCurrImgId())
}

function dropText(ev) {

    ev.preventDefault()
    ev.stopPropagation()

    gDragOn = false

    var meme = getMeme()
    if (gFocustxt) {
        var lines = meme.lines
        var idx = 0
        lines.forEach(function (line) {
            if (line.isDrag) {
                updateDragging(idx, 'lines', false)
                return
            }
            idx++
        })
    }

    // if (gFocusSticker) {
    //     var stickers = meme.stickers
    //     var idx = 0
    //     stickers.forEach(function (sticker) {
    //         if (sticker.isDrag) {
    //             updateDragging(idx, 'stickers', false)
    //             return
    //         }
    //         idx++
    //     })
    // }

    gCurrPosX = undefined
    gCurrPosY = undefined
}

function addDragDrop() {
    gCanvas.addEventListener('mousedown', dragText)
    gCanvas.addEventListener('mouseup', dropText)
    gCanvas.addEventListener('mousemove', moveText)

    gCanvas.addEventListener('touchstart', dragText)
    gCanvas.addEventListener('touchend', dropText)
    gCanvas.addEventListener('touchmove', moveText)
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
    gFocustxt = true
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

