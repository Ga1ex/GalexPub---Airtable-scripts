//Press F12, find section contatining comments, save as text file
const html=await input.fileAsync('select file').then(filetext=>filetext.parsedContents)

//Define patterns to divide comments from each other, to find comment start and end
const [divider,start,end]=['<div dir="ltr" class="update-components-text relative">',
'<span dir="ltr">','</span>']

//Define waste pieces of html to remove from text
const textToClean=['<!---->','<span class="white-space-pre">']

//Cleaner function
const clean=txt=>textToClean.reduce((acc,el)=>acc.split(el).join(''),txt)

//Parser function, gets cleaned text from 'start' to 'end'
const parse=text=>clean(text).split(start,2).pop().split(end,2).shift()

//Remove parts of html before first divider and after the last divider
const unwrap=arr=>arr.slice(1,arr.length-2).map(clean)

//Load text and parse
let getComments=text=>unwrap(text.split(divider)).map(parse).join('\n \n')
console.log(getComments(html))