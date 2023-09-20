let settings = input.config({title: 'Transpose table',
items:  [input.config.table('tTable', {label: 'Select table' }),
  input.config.view('tView',{label: 'Select view',parentTable:'tTable'}),  
  input.config.text('tName',{label:'Name of transposed table'}),
  input.config.text('tWild',{label:'Wildcard for fields to transpose',description:
  `Example: if you want to transpose fields "Agent 1", "Agent 3", "Agent 4", input "agent". Case insensitive.
   You can put several wildcards, separated by comma. Later you can add fields.`
  })]
})
const {tTable,tView,tName,tWild}=settings

const primary=tTable.fields[0].name
const tWilds=tWild.split(',').map(w=>w.toUpperCase())
const wildCheck=fname=>tWilds.some(w=>fname.name.toUpperCase().includes(w))
let tFields=tTable.fields.filter(wildCheck).filter(f=>f.name!=primary)
const fNames=arr=>arr.map(a=>a.name).filter(n=>n!=primary)

let goleft='loop until chosen'; let leftSide=[primary]
let ask=''; let chosen=fNames(tFields)
let restFields=fNames(tTable.fields).filter(t=>!chosen.includes(t))
restFields.unshift('All OK');
while (ask!='All OK') {
ask=restFields.length==1? 'All OK':await input.buttonsAsync('Choose fields: ', restFields)
chosen.push(restFields.splice(restFields.indexOf(ask),1)[0]);
output.clear; output.text('Chosen fields: '+chosen.join(', '));
output.text('==================')
}

let allFields=fNames(tTable.fields)
while(!chosen.includes(goleft)){
  goleft=allFields.shift()
  leftSide.push(goleft)
}
output.text(`These fields detected as left side: ${leftSide.join(',')}`)
output.text('If something wrong, quit and try to move fields in view')


const query=await tTable.selectRecordsAsync({fields:[...leftSide,...chosen]})
output.text(`Total records: ${query.records.length} and ${chosen.length} fields to transpose`)
const leftpart=r=>leftSide.map(f=>[f,r.getCellValueAsString(f)])
const trans=r=>chosen.map(f=>[[newCol,f],[newVal,r.getCellValueAsString(f)]
,...leftpart(r),[,[{id:r.id}]]])

const newLink='Link_'+tTable.name; 
const newCol=tWilds[0]; const newVal=newCol+'_value'
const crtField=n=>({'name':n,'type':'singleLineText'})
const newFields=[...leftSide,newCol,newVal,...chosen,newLink]
// @ts-ignore
const newID=await base.createTableAsync(tName,newFields.map(crtField))
const newTab=base.getTable(newID)
const create=r=>({fields:Object.fromEntries(trans(r))})
const crt=query.records.map(create)

const total=query.records.length*chosen.length
output.text(`Table ${newTab.name} will be fiilled with ${total} records`)
console.log(crt)
const go=await input.buttonsAsync('Press GO to start',['GO','Quit'])
if(go=='GO') while (crt.length) await newTab.createRecordsAsync(crt.splice(0,50))
output.text(go=='Quit'? 'upload skipped...':'Done') 