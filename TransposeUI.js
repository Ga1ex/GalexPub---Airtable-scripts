//galex,2013 
//Read settings
let settings = input.config({title: 'Transpose table',
items:  [input.config.table('tTable', {label: 'Select table' }),
  input.config.view('tView',{label: 'Select view',parentTable:'tTable'}),  
  input.config.text('tName',{label:'Name of transposed table'}),
  input.config.text('tWild',{label:'Wildcard for fields to transpose',description:
  `Example: if you want to transpose fields "Agent 1", "Agent 3", "Agent 4", input "agent". Case insensitive.
   You can put several wildcards, separated by comma.`
  })]
})
const {tTable,tView,tName,tWild}=settings

//Find fields to transpose
const primary=tTable.fields[0].name
const tWilds=tWild.split(',').map(w=>w.toUpperCase())
const wildCheck=fname=>tWilds.some(w=>fname.name.toUpperCase().includes(w))
let tFields=tTable.fields.filter(wildCheck).filter(f=>f.name!=primary)
const fNames=arr=>arr.map(a=>a.name).filter(n=>n!=primary)
let chosen=fNames(tFields)
console.log(`These fields will be transposed: ${chosen.join(', ')}`)

//Ask for left side
let ask=''; let leftSide=[primary]
let restFields=fNames(tTable.fields).filter(t=>!chosen.includes(t))
restFields.unshift('All OK');
while (ask!='All OK') {
output.text('Current left side: '+leftSide.join(', '));
ask=restFields.length==1? 'All OK':await input.buttonsAsync('Choose left side fields: ', restFields)
leftSide.push(restFields.splice(restFields.indexOf(ask),1)[0]);
output.clear; output.text('==================')}
leftSide.pop() // put out All OK from fieldlist

//Read and transform data
const query=await tView.selectRecordsAsync({fields:[...leftSide,...chosen]})
output.text(`Total records: ${query.records.length} and ${chosen.length} fields to transpose`)
const leftpart=r=>leftSide.map(f=>[f,r.getCellValueAsString(f)])
const trans=r=>chosen.map(f=>({fields:Object.fromEntries([[newCol,f],
[newVal,r.getCellValueAsString(f)],...leftpart(r),[newLink,[{id:r.id}]]])}))

//Create new table
const newLink='Link_'+tTable.name; 
const newCol=tWilds[0]; const newVal=newCol+'_value'
const crtField=n=>({'name':n,'type':'singleLineText'})
const newflds=[...leftSide,newCol,newVal].map(crtField)
newflds.push({name:newLink,type:'multipleRecordLinks',options:{linkedTableId:tTable.id}})
// @ts-ignore
const newID=await base.createTableAsync(tName,newflds)
const newTab=base.getTable(newID)

//fill new table with transposed data
const crt=query.records.flatMap(trans)
const total=query.records.length*chosen.length
output.text(`Table ${newTab.name} will be fiilled with ${total} records`)
console.log(crt)
const go=await input.buttonsAsync('Press GO to start',['GO','Quit'])
if(go=='GO') while (crt.length) await newTab.createRecordsAsync(crt.splice(0,50))
output.text(go=='Quit'? 'upload skipped...':'Done') 