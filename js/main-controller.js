'use strict'

var elGallery = document.querySelector('.main-container-image')
var elEditor = document.querySelector('.main-container-editor')
var elSaveMeme = document.querySelector('.main-container-save')
var elAbout = document.querySelector('.main-card')
var elSearchBar = document.querySelector('.search-bar')

var gSave = []
var gCurrPosX
var gCurrPosY
var gCanvas
var gCtx
var gLocalImg
var gStartPos
var gNoFocus
var gCurrPage = 1
var gStickersInPage = 3
var gDragOn = false
var gFocustxt = true
var gFocusSticker = false
var gIsLocalImg = false
var gIsDraw = true
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
const keyImg = 'meme'

function init() {
    gNoFocus = false
    renderImgs()
    gCanvas = document.getElementById('meme-canvas')
    gCtx = gCanvas.getContext('2d');
    onPage('Gallery')
    addDragDrop()
    loadMyMemeFromStorage()
    window.addEventListener('resize', checkResizeCanvas)
}

function reset() {
    gMeme = getEmptyMeme()
    gNoFocus = false
}

function addDragDrop() {
    gCanvas.addEventListener('mousedown', dragText)
    gCanvas.addEventListener('mouseup', dropText)
    gCanvas.addEventListener('mousemove', moveText)

    gCanvas.addEventListener('touchstart', dragText)
    gCanvas.addEventListener('touchend', dropText)
    gCanvas.addEventListener('touchmove', moveText)
}

function drawText() {
    for (var i = 0; i < gMeme.lines.length; i++) {
        var textString = onGetMemeText(i);
        var xCor = getLinePos(i).x
        var yCor = getLinePos(i).y;
        gCtx.textAlign = gMeme.lines[i].align;
        gCtx.font = `${gMeme.lines[i].size}px ${gFont}`;
        gCtx.lineWidth = 3;
        gCtx.strokeStyle = gBorderColor;
        if (!gNoFocus) {
            if (getSelectedLine() === i) {
                var heightText = gMeme.lines[i].size;
                var y = gMeme.lines[i].pos.y;

                gCtx.strokeStyle = gBorderColor;
                gCtx.beginPath();
                gCtx.rect(10, y - heightText, gCanvas.width - 20, heightText + 10);
                gCtx.stroke();
            }
        }
        gCtx.strokeText(textString, xCor, yCor);
        gCtx.fillStyle = gFillColor;
        gCtx.fillText(textString, xCor, yCor);
    }
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
        var disX = offsetX - gCurrPosX
        var disY = offsetY - gCurrPosY
        var meme = getMeme()
        if (gFocustxt) {
            var lines = meme.lines
            lines.forEach(function (line) {
                if (line.isDrag) {
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

    lines.forEach(function (line, idx) {
        if (offsetX > line.pos.x - 160 &&
            offsetX < line.pos.x + 160 &&
            offsetY > line.pos.y - 40 &&
            offsetY < line.pos.y + 10) {
            switchLinesDrogDrop(idx)
            updateDragging(idx, 'lines', true)
            document.querySelector('.control-txt-input').value = line.txt
            onDisplayMemeImg(getCurrImgId())
            gDragOn = true
            gFocustxt = true
            gFocusSticker = false
            return
        }
    })
    var stickers = meme.stickers

    stickers.forEach(function (sticker, idx) {
        if (offsetX > sticker.positionX - 10 &&
            offsetX < sticker.positionX + sticker.width + 10 &&
            offsetY > sticker.positionY - 10 &&
            offsetY < sticker.positionY + sticker.height + 10) {
            switchStickersDrogDrop(idx)
            updateDragging(idx, 'stickers', true)
            onDisplayMemeImg(getCurrImgId())
            gDragOn = true
            gFocusSticker = true
            gFocustxt = false
            return
        }
    })
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
    if (gFocusSticker) {
        var stickers = meme.stickers
        var idx = 0
        stickers.forEach(function (sticker) {
            if (sticker.isDragging) {
                updateDragging(idx, 'stickers', false)
                return
            }
            idx++
        })
    }
    gCurrPosX = undefined
    gCurrPosY = undefined
}

function onRenderStickers() {
    var stickers = getStickers()
    var strHtml = ''
    stickers.forEach(sticker => {
        strHtml += `<img src="${sticker.url}" class="sticker" id="sticker-num-${sticker.id}" onclick="drawSticker(${sticker.id})">`
    })
    document.querySelector('.stickers-div').innerHTML = strHtml

}

function onSortKeywords(Keyword) {
    var key = Keyword.toLowerCase()
    sortKeywords(key)
}

function drawSticker(stickerId) {
    var meme = getMeme()
    var isStickerExist = meme.stickers.find(sticker => sticker.id === stickerId)
    if (isStickerExist) {
        switchStickers(stickerId)
        gFocustxt = false
        gFocusSticker = true
    } else {
        var stickers = getStickers()
        var sticker = stickers[stickerId - 1]
        var elSticker = document.querySelector(`#sticker-num-${stickerId}`)
        gCtx.drawImage(elSticker, sticker.positionX, sticker.positionY)
        addSticker(sticker)
        gFocusSticker = true
        gFocustxt = false
    }
    onDisplayMemeImg(getCurrImgId());
}

function drawStickers() {
    var meme = getMeme()
    var stickers = meme.stickers
    if (stickers.length === 0) return
    else stickers.forEach(sticker => {
        var elSticker = document.querySelector(`#sticker-num-${sticker.id}`)
        gCtx.drawImage(elSticker, sticker.positionX, sticker.positionY, sticker.width, sticker.height)
    })
}


function onPage(page) {
    switch (page) {
        case 'Gallery':
            reset()
            elGallery.style.display = 'grid'
            elSearchBar.style.display = 'flex'
            elEditor.style.display = 'none'
            elAbout.style.display = 'none'
            elSaveMeme.style.display = 'none'
            break;
        case 'Memes':
            renderSave(gSave)
            var elMemes = document.querySelector('.memes')
            elMemes.innerHTML = '<span> MEMES </span>'
            elSaveMeme.style.display = 'grid'
            elSearchBar.style.display = 'none'
            elGallery.style.display = 'none'
            elEditor.style.display = 'none'
            elAbout.style.display = 'none'
            break;
        case 'About':
            elSaveMeme.style.display = 'none'
            elSearchBar.style.display = 'none'
            elGallery.style.display = 'none'
            elEditor.style.display = 'none'
            elAbout.style.display = 'block'
            break;
    }
}

function onSetLang(lang) {
    setLang(lang);
    var elBody = document.querySelector('body')
    if (lang === 'he') {
        elBody.classList.add('rtl')
    } else {
        elBody.classList.remove('rtl')
    }
    doTrans()
}

function onSaveMeme() {
    var elMemes = document.querySelector('.memes')
    elMemes.innerHTML = '<span class="save"> MEMES *</span>'
    saveMeme()
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
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

function onDeleteLine() {
    if (gFocustxt) deleteLine()
    else deleteSticker()
    onDisplayMemeImg(getCurrImgId());
}

function onAddLine() {
    addLine('NEW LINE')
    onDisplayMemeImg(getCurrImgId());
}

function onSetCurrImg(imgId) {
    clearCanvas()
    setSelectedImage(+imgId)
    onDisplayMemeImg(getCurrImgId());
    resizeCanvas()
    checkResizeCanvas()
    elSaveMeme.style.display = 'none'
    elEditor.style.display = 'flex'
    elGallery.style.display = 'none'
    elSearchBar.style.display = 'none'
    onRenderStickers()
    uploadImg()
}

function onChangeFont(fontName) {
    changeFont(fontName)
    onDisplayMemeImg(getCurrImgId())
}

function onIncreaseFont() {
    if (gFocustxt) increaseFont()
    else changeSize(5)
    onDisplayMemeImg(getCurrImgId())
}

function onDecreaseFont() {
    if (gFocustxt) decreaseFont()
    else changeSize(-5)
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

function onDownloadImg(elLink) {
    gNoFocus = true
    onDisplayMemeImg(getCurrImgId())
    // downloadImg(elLink)
}

function _showSelectedLine() {
    return getSelectedLine();
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

function checkResizeCanvas() {
    if (window.matchMedia('(max-width: 555px)').matches) {
        if (document.body.classList.contains('small')) return
        resizeCanvas(350, true)
        document.body.classList.remove('big')
        document.body.classList.add('small')
    } else {
        if (document.body.classList.contains('big')) return
        resizeCanvas(600, true)
        document.body.classList.remove('small')
        document.body.classList.add('big')
    }
}

function resizeCanvas(diff = 600, isRender) {
    var imgId = getSelectedImg()
    var elImg = document.querySelector(`.el${imgId}`)
    var ratio = elImg.width / elImg.height
    gCanvas.width = diff
    gCanvas.height = (gCanvas.width / ratio)
    changePosTexts(gCanvas.width, gCanvas.height)
    if (isRender) onDisplayMemeImg(getCurrImgId())
}

function onDisplayMemeImg(id) {
    var memeImg = new Image();
    memeImg.src = onGetMemeUrl(id);
    memeImg.onload = function () {
        // resizeCanvas()
        gCtx.drawImage(memeImg, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
        drawStickers()
    };
}

function renderImgs(imgs = gImgs) {
    var strHTML = ''
    imgs.forEach(img => {
        strHTML += `
    <img src="${img.url}" id="${img.id}" class="card-image el${img.id}" onclick="onSetCurrImg(this.id)" />`
    })
    var elImgContainer = document.querySelector('.main-container-image')
    elImgContainer.innerHTML = strHTML
}

function renderSave(imgs = gSave) {
    var memes = imgs.map(meme => {
        return gImgs.find(img => img.id === meme.selectedImgId)
    })
    var strHTML = ''
    memes.forEach((img, idx) => {
        strHTML += `<div class="save-img">
    <img src="${img.url}" id="${img.id}" class="card-image el${img.id}" onclick="onBackImg(${idx})" /> <span class="delete" onclick="onDeleteSaveMeme(${idx})">delete</span> </div>`
    })
    var elImgContainer = document.querySelector('.main-container-save')
    elImgContainer.innerHTML = strHTML
}

function onBackImg(id) {
    var meme = loadMyMemeFromStorage()
    var imgs = gImgs
    var res = imgs.find(img => img.id === meme[id].selectedImgId)
    var currMeme = meme.filter(me => me.selectedImgId === res.id)
    console.log(currMeme);
    gMeme = currMeme[0]
    onDisplayMemeImg(res.id)
    drawText()
    elSaveMeme.style.display = 'none'
    elEditor.style.display = 'flex'
    elGallery.style.display = 'none'
    elSearchBar.style.display = 'none'
}

function onDeleteSaveMeme(saveMemeIdx) {
    var saveMemes = loadMyMemeFromStorage()
    saveMemes.splice(saveMemeIdx, 1)
    saveMyMemeToStorage(saveMemes)
    renderSave()
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}