// console.log('window: ', window)
const { ipcRenderer } = require('electron')
const moment = require('moment')

console.log('open-file.js loaded')
const openButton = document.getElementById('button-open')

openButton.addEventListener('click', event => {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', (event, path) => {
  console.log('path: ', path)
  document.getElementById('selected-file').innerHTML = path[0]

  const splitFilename = path[0].split('/')

  const genDate = moment().format('YYYYMMDD')
  const genDateFormat2 = moment().format('MM/DD/YYYY')
  const source = 'CCU_CC'
  const systemType = '123'
  const seq = '1'
  const fileExt = 'xml'
  const convertContent = [6, 7, 8, 9, 10].map(item => {
    const outputFileName = `${genDate}.${source}.${systemType}.${seq}.${item}.${fileExt}`
    const newPath = [...splitFilename.slice(0, splitFilename.length - 1), outputFileName].join('/')
    return `<div class="result-item">
      <div>${newPath}</div>
      <button id="button-convert" data-file-type="${item}" data-gen-date="${genDateFormat2}" 
      data-org-file-path="${path[0]}" data-file-path="${newPath}" onClick="onClickConvert(this)">convert</button>
    </div>`
  }).join('\n')
  document.getElementById('convert-wrapper').insertAdjacentHTML('afterbegin', convertContent)
})

const onClickConvert = element => {
  console.log('element: ', element.dataset)
  ipcRenderer.send('convert-file', { ...element.dataset })
}
