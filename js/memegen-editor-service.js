'use strict'
var gFont = 'Impact'
var gFillColor = 'white'
var gBorderColor = 'black'
var gIsSaveProcess = false;

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Im always eat Falafel',
            size: 40,
            align: 'center',
            color: 'red',
            pos: { x: 500 / 2, y: 60 },
            borderY: 10,
        },
        {
            txt: ' OKAY OKAY OKAY',
            size: 30,
            align: 'center',
            color: 'red',
            pos: { x: 450 / 2, y: 460 },
            borderY: 490,
        },
    ],
};

var gStickers = [
    {
        id: 1,
        url: 'stickers/1.png',
        positionX: 225,
        positionY: 225,
        isDragging: false,
        height: 32,
        width: 85

    },
    {
        id: 2,
        url: 'stickers/2.png',
        positionX: 230,
        positionY: 230,
        isDragging: false,
        height: 32,
        width: 85

    },
    {
        id: 3,
        url: 'stickers/3.png',
        positionX: 240,
        positionY: 240,
        isDragging: false,
        height: 32,
        width: 85

    },
    {
        id: 4,
        url: 'stickers/4.png',
        positionX: 250,
        positionY: 250,
        isDragging: false,
        height: 32,
        width: 85

    },
]

function drawText() {
    for (var i = 0; i < gMeme.lines.length; i++) {
        var textString = onGetMemeText(i);
        var xCor = getLinePos(i).x;
        var yCor = getLinePos(i).y;
        gCtx.textAlign = gMeme.lines[i].align;
        gCtx.font = `${gMeme.lines[i].size}px ${gFont}`;
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = gBorderColor;
        if (!gIsSaveProcess) {
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
function drewSticker(){

}

function chooseStickers(){

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

function addLine(txt) {
    gMeme['lines'].push({
        txt: txt,
        size: 40,
        align: 'center',
        color: 'black',
        pos: { x: gCanvas.width / 2, y: gCanvas.height / 2 },
    });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    gMeme['lines'].splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
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

function setSelectedImage(imgId) {
    gMeme.selectedImgId = +imgId;
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