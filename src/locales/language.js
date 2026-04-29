import xlsx from 'node-xlsx'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

console.log('---- language start ----')

const ex = xlsx.parse('./lang.xlsx')
const content = ex[0].data
const startTime = Date.now() // 开始时间

const titlesCol = content[0]
const langTitle = []

// 设置语言使用Map存储
const langMap = new Map()
for (let i = 1; i < titlesCol.length; i++) {
  const [title] = titlesCol[i].split('/')
  langTitle.push(title)
  langMap.set(title, {}) // 存储空MAP
}

// 创建key-value
for (let i = 1; i < content.length; i++) {
  if (content.length === 0) {
    break
  }

  const [key] = content[i]
  for (let j = 0; j < langTitle.length; j++) {
    const mapKey = langTitle[j]
    const obj = { ...langMap.get(mapKey) }

    if (content[i][j + 1]) {
      obj[key] = content[i][j + 1]
    }

    langMap.set(mapKey, obj)
  }
}

// 保存到本地
let successCount = 0 // 成功计数
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const i18nPath = path.join(__dirname, 'json')

// 判断文件夹是否存在
fs.stat(i18nPath, (err) => {
  if (err) {
    // 如果文件夹不存在，则创建文件夹
    if (err.code === 'ENOENT') {
      fs.mkdir(i18nPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating folder:', err)
          return
        }
        console.log('Folder created successfully.')
        createFile()
      })
    } else {
      console.error('Error checking folder:', err)
    }
    return
  }

  createFile()
})

function createFile() {
  for (let [key, value] of langMap.entries()) {
    fs.writeFile(`${i18nPath}/${key}.json`, `${JSON.stringify(value)}`, (err) => {
      if (err) {
        console.error('---- language run failed ----')
        console.error(err)
        return
      }

      console.log(`----------> ${key} create success!`)
      successCount++
      if (successCount === langMap.size) {
        const endTime = Date.now()
        const runTime = (endTime - startTime) / 1000
        console.log(`---- language run success, Time consuming: ${runTime}s ----`)
      }
    })
  }
}
