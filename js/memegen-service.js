'use strict'

var gFont = 'Impact'
var gFillColor = 'white'
var gBorderColor = 'black'
var gIsSaveProcess = false;
var gImgs = getImgs()



var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    selectedStickerIdx: 0,
    lines: [{
            txt: 'Falafel',
            size: 40,
            align: 'center',
            pos: {
                x: 600 / 2,
                y: 60
            },
            isDrag: false
        },
        {
            txt: 'OKAY OKAY',
            size: 30,
            align: 'center',
            pos: {
                x: 600 / 2,
                y: 550
            },
            isDrag: false
        },
    ],
    stickers: []
};

var gStickers = [{
        id: 1,
        url: 'stickers/1.png',
        positionX: 100,
        positionY: 100,
        isDragging: false,
        height: 120,
        width: 160
    },
    {
        id: 2,
        url: 'stickers/2.png',
        positionX: 100,
        positionY: 100,
        isDragging: false,
        height: 150,
        width: 150
    },
    {
        id: 3,
        url: 'stickers/3.png',
        positionX: 100,
        positionY: 100,
        isDragging: false,
        height: 85,
        width: 100
    },
    {
        id: 4,
        url: 'stickers/4.png',
        positionX: 100,
        positionY: 100,
        isDragging: false,
        height: 85,
        width: 85
    },
    {
        id: 5,
        url: 'stickers/5.png',
        positionX: 100,
        positionY: 100,
        isDragging: false,
        height: 120,
        width: 130
    },
]

function getImgs() {
    return [{
            id: 1,
            url: 'img/1.jpg',
            keywords: ['funny']
        },
        {
            id: 2,
            url: 'img/2.jpg',
            keywords: ['history']
        },
        {
            id: 3,
            url: 'img/3.jpg',
            keywords: ['politics', 'funny']
        },
        {
            id: 4,
            url: 'img/4.jpg',
            keywords: ['baby', 'cute']
        },
        {
            id: 5,
            url: 'img/5.jpg',
            keywords: ['baby', 'cute']
        },
        {
            id: 6,
            url: 'img/6.jpg',
            keywords: ['baby', 'cute']
        },
        {
            id: 7,
            url: 'img/7.jpg',
            keywords: ['funny']
        },
        {
            id: 8,
            url: 'img/8.jpg',
            keywords: ['funny', 'cute']
        },
        {
            id: 9,
            url: 'img/9.jpg',
            keywords: ['funny', 'cute', 'baby']
        },
        {
            id: 10,
            url: 'img/10.jpg',
            keywords: ['politics']
        },
        {
            id: 11,
            url: 'img/11.jpg',
            keywords: ['funny']
        },
        {
            id: 12,
            url: 'img/12.jpg',
            keywords: ['politics']
        },
        {
            id: 13,
            url: 'img/13.jpg',
            keywords: ['funny']
        },
        {
            id: 14,
            url: 'img/14.jpg',
            keywords: ['funny']
        },
        {
            id: 15,
            url: 'img/15.jpg',
            keywords: ['funny', 'politics']
        },
        {
            id: 16,
            url: 'img/16.jpg',
            keywords: ['funny']
        },
        {
            id: 17,
            url: 'img/17.jpg',
            keywords: ['funny', 'cute', 'baby']
        },
        {
            id: 18,
            url: 'img/18.jpg',
            keywords: ['cute', 'baby'],
        },
        {
            id: 19,
            url: 'img/19.jpg',
            keywords: ['funny']
        },
        {
            id: 20,
            url: 'img/20.jpg',
            keywords: ['funny']
        },
        {
            id: 21,
            url: 'img/21.jpg',
            keywords: ['politics']
        },
    ]
}

function getEmptyMeme() {
    return {
        selectedImgId: 1,
        selectedLineIdx: 0,
        selectedStickerIdx: 0,
        lines: [{
                txt: 'Falafel',
                size: 40,
                align: 'center',
                pos: {
                    x: 600 / 2,
                    y: 60
                },
                isDrag: false
            },
            {
                txt: 'OKAY OKAY',
                size: 30,
                align: 'center',
                pos: {
                    x: 600 / 2,
                    y: 550
                },
                isDrag: false
            },
        ],
        stickers: []
    };
}

function fontPos(pos) {
    var lineIdx = gMeme.selectedLineIdx;
    switch (pos) {
        case 'right':
            gMeme.lines[lineIdx].align = 'left'
            break;
        case 'center':
            gMeme.lines[lineIdx].align = 'center'
            break;
        case 'left':
            gMeme.lines[lineIdx].align = 'right'
            break;
    }
}

function changePositionY(num) {
    if (gFocustxt) {
        if (gMeme.lines.length === 0) return
        const lineIdx = gMeme.selectedLineIdx
        gMeme.lines[lineIdx].pos.y += num
    }
    if (gFocusSticker) {
        if (gMeme.stickers.length === 0) return
        const stickerIdx = gMeme.selectedStickerIdx
        gMeme.stickers[stickerIdx].positionY += num
    }
}

function changePositionX(num) {
    if (gFocustxt) {
        if (gMeme.lines.length === 0) return
        const lineIdx = gMeme.selectedLineIdx
        gMeme.lines[lineIdx].pos.x += num
    }
    if (gFocusSticker) {
        if (gMeme.stickers.length === 0) return
        const stickerIdx = gMeme.selectedStickerIdx
        gMeme.stickers[stickerIdx].positionX += num
    }
}

function changePosTexts(width, height) {
    gMeme.lines.forEach(line => {
        line.pos.x = (width / 2)
        if (line.pos.y > height) line.pos.y = (height - 20)
    })
}

function addLine(txt) {
    gMeme['lines'].push({
        txt: txt,
        size: 40,
        align: 'center',
        color: 'black',
        pos: {
            x: gCanvas.width / 2,
            y: gCanvas.height / 2
        },
    });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function sortKeywords(Keyword) {
    var imgs = getImgs()
    if (!Keyword) return renderImgs()
    var filter = imgs.filter(img => {
        return img.keywords.some(Key => Key === Keyword)
    })
    renderImgs(filter)
}

function saveMeme() {
    gSave.push(gMeme)
    _saveMemeToStorage()
}

function loadMyMemeFromStorage() {
    gSave = loadFromStorage(keyImg)
    if (!gSave) gSave = []
    return gSave
}

function saveMyMemeToStorage(newSaveMemes) {
    gSave = newSaveMemes
    _saveMemeToStorage()
}

function _saveMemeToStorage() {
    saveToStorage(keyImg, gSave)
}

function addSticker(sticker) {
    gMeme.stickers.push(sticker)
    gMeme.selectedStickerIdx = gMeme.stickers.length - 1
}


function switchStickers(id) {
    var focusSticker = gMeme.stickers.findIndex(sticker => sticker.id === id)
    gMeme.selectedStickerIdx = focusSticker
}

function switchStickersDrogDrop(idx) {
    gMeme.selectedStickerIdx = idx
}

function saveImg(data) {
    gSavedImgs.unshift(data)
    saveToStorage(keyImgs, gSavedImgs)
}

function changeColorFill(color = 'white') {
    gFillColor = color
    onDisplayMemeImg(getCurrImgId())
}

function changeColorBorder(color = 'black') {
    gBorderColor = color
    onDisplayMemeImg(getCurrImgId())
}

function changeFont(fontName) {
    gFont = fontName
}

function increaseFont() {
    var lineIdx = gMeme.selectedLineIdx;
    gMeme.lines[lineIdx].size += 5
}

function decreaseFont() {
    var lineIdx = gMeme.selectedLineIdx;
    gMeme.lines[lineIdx].size -= 5
}

function changeSize(num) {
    if (gFocusSticker) {
        if (gMeme.stickers.length === 0) return
        const stickersIdx = gMeme.selectedStickerIdx
        gMeme.stickers[stickersIdx].height += num
        gMeme.stickers[stickersIdx].width += num
    }
}

function deleteLine() {
    gMeme['lines'].splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteSticker() {
    gMeme['stickers'].splice(gMeme.selectedStickerIdx, 1);
    gMeme.selectedStickerIdx = gMeme.stickers.length - 1;
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
    gNoFocus = false
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function changePos(diff) {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += diff;
}

function changeText(newTxt) {
    var lineIdx = gMeme.selectedLineIdx;
    gMeme.lines[lineIdx].txt = newTxt;
}

function switchLine() {
    gMeme.selectedLineIdx += 1;
    if (gMeme.selectedLineIdx === gMeme['lines'].length) gMeme.selectedLineIdx = 0;
}

function switchLinesDrogDrop(idx) {
    gMeme.selectedLineIdx = idx
}

function updateDragging(idx, type, bool) {
    if (type === 'lines') gMeme.lines[idx].isDrag = bool
    if (type === 'stickers') gMeme.stickers[idx].isDragging = bool
}

function setSelectedImage(imgId) {
    gMeme.selectedImgId = +imgId;
}

function getSelectedImg() {
    return gMeme.selectedImgId
}

function getStickers() {
    return gStickers
}

function getMemeImg() {
    var img = gImgs.find((img) => img.id === gMeme.selectedImgId);
    return img;
}

function getMemeText(lineIdx) {
    return gMeme.lines[lineIdx].txt;
}

function getLinePos(idx) {
    return gMeme.lines[idx].pos;
}

function getSelectedLine() {
    return gMeme.selectedLineIdx;
}

function getCurrImgId() {
    return gMeme.selectedImgId;
}

function getMeme() {
    return gMeme
}