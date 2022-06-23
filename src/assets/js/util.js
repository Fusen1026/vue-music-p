export function shuffle(source) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr, indexA, indexB) {
  var temp = arr[indexA]
  arr[indexA] = arr[indexB]
  arr[indexB] = temp
}

export function formatTime(interval) {
  const time = interval | 0
  const minute = ((time / 60 | 0) + '').padStart(2, 0)
  const second = ((time % 60 | 0) + '').padStart(2, 0)
  return `${minute}:${second}`
}
