const { ipcMain, dialog } = require('electron')

ipcMain.on('open-file-dialog', event => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'CSV file', extensions: ['csv'] }
    ]
  }).then(result => {
    if (result.canceled) {
      console.log('canceled')
    } else if (result.filePaths) {
      console.log('files: ', result.filePaths)
      event.sender.send('selected-directory', result.filePaths)
    }
  })
})
