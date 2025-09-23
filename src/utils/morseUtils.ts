const morseCodes = {
  "A": ".-",
  "B": "-...",
  "C": "-.-.",
  "D": "-..",
  "E": ".",
  "F": "..-.",
  "G": "--.",
  "H": "....",
  "I": "..",
  "J": ".---",
  "K": "-.-",
  "L": ".-..",
  "M": "--",
  "N": "-.",
  "O": "---",
  "P": ".--.",
  "Q": "--.-",
  "R": ".-.",
  "S": "...",
  "T": "-",
  "U": "..-",
  "V": "...-",
  "W": ".--",
  "X": "-..-",
  "Y": "-.--",
  "Z": "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "&": ".-...",
  "'": ".----.",
  "@": ".--.-.",
  ")": "-.--.-",
  "(": "-.--.",
  ":": "---...",
  ",": "--..--",
  "=": "-...-",
  "!": "-.-.--",
  ".": ".-.-.-",
  "-": "-....-",
  "×": "-..-",
  "%": "----- -..- .---- .-. .----",
  "+": ".-.-.",
  "\"": ".-..-.",
  "?": "..--..",
  "/": "-..-.",
  "À": ".--.-",
  "Å": ".--.-",
  "Ä": ".-.-",
  "Ą": ".-.-",
  "Æ": ".-.-",
  "Ć": "-.-..",
  "Ĉ": "-.-..",
  "Ç": "-.-..",
  "Ch": "----",
  "Ĥ": "----",
  "Š": "----",
  "Đ": "..--.",
  "É": "..-..",
  "Ę": "..-..",
  "Ð": "..--.",
  "È": ".-..-",
  "Ł": ".-..-",
  "Ĝ": "--.-.",
  "Ĵ": ".---.",
  "Ń": "--.--",
  "Ñ": "--.--",
  "Ó": "---.",
  "Ö": "---.",
  "Ø": "---.",
  "Ś": "...-...",
  "Ŝ": "...-.",
  "Þ": ".--..",
  "Ü": "..--",
  "Ŭ": "..--",
  "Ź": "--..-.",
  "Ż": "--..-."
}

function isMorseCode(str: string) {
  const regex = new RegExp(`^[\\s\\-\\./ ]+$`);
  return regex.test(str);
}

const morseConverter = (text: string, unsupportedCharacters: string[]) => {
  let convertedMessage = ''
  let updatedUnsupportedCharacters: string[] = [...unsupportedCharacters]

  text.split('').forEach((char) => {
    if (char != ' ') {
      if (!morseCodes.hasOwnProperty(char.toUpperCase())) {
        if (!updatedUnsupportedCharacters.includes(char)) {
          updatedUnsupportedCharacters.push(char)
        }
      }
    }
  })

  if (text) {
    if (isMorseCode(text)) {
      let morsWords = text.split('/') // ['... --- ...', '... --- ...']
      convertedMessage = morsWords.map((mw) => {
        let morsLetters = mw.split(' ') // ['...', '---', '...']
        return morsLetters.map((ml) => {
          let letter = Object.keys(morseCodes).find(key => morseCodes[key as keyof typeof morseCodes] === ml)
          return letter || '' // 'S'
        }).join('') // 'SOS'
      }).join(' ') // 'SOS SOS'
    }
    else {
      let words = text.split(' ') // ['SOS', 'SOS']
      convertedMessage = words.map((mw) => {
        let wordLetters = mw.split('') // ['S', 'O', 'S']
        return wordLetters.map((wl) => {
          let letter = morseCodes[wl.toUpperCase() as keyof typeof morseCodes]
          return letter || '#' // 'S'
        }).join(' ') // 'S O S'
      }).join(' / ') // 'SOS / SOS'
    }
  }

  return { convertedMessage, updatedUnsupportedCharacters }
}


export { morseCodes, isMorseCode, morseConverter }