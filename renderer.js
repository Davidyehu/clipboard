const { ipcRenderer } = require('electron')
const historyList = document.getElementById('history')

ipcRenderer.on('update-clipboard', (event, data) => updateHistory(data))

function updateHistory(data) {
  historyList.innerHTML = ''
  data.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    historyList.appendChild(li)
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await ipcRenderer.invoke('get-clipboard-history')
  updateHistory(data)
})