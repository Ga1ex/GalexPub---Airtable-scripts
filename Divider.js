//galex,2013  Read settings
let settings = input.config({title: 'Divide values',
items:  [input.config.table('dTable', {label: 'Select table' }),
  input.config.view('dView',{label: 'Select view',parentTable:'dTable'}),
  input.config.field('dField',{label: 'Select field to divide',parentTable:'dTable',
  description:`To split cell with 'new line' as divider, use SUBSTITUTE(Name,'\\n', ',') to process `}),  
  input.config.text('dName',{label:'Name of target fields(_#):'}),
  input.config.text('divide',{label:'Divider(s) separated by +',description:
  `Example: to separate by word ' AND ', ampersand(&) and comma, type " AND +&+,"`
  })]
})
const {dTable,dView,dField,dName,divide}=settings


//Read and transform source field
const divs=divide.split('+').filter(n=>n)
const dReplace=t=>divs.reduce((x,div)=>x.split(div).join('{div}'),t)
const parts=val=>dReplace(val).split('{div}').filter(n=>n)

const writer=r=>({id:r.id,obj:parts(r.getCellValueAsString(dField))})
const query=await dView.selectRecordsAsync({fields:[dField.name]}).then(q=>q.records)
output.inspect(divs)

//Prepare data for new fields and their values
let newfields=[]; 
let existing=new Set(dTable.fields.map(f=>f.name))
const addfield=fld=>{ newfields.push(fld); existing.add(fld) }
const checkFld=name=>!(existing.has(name))
const write=arr=>arr.map((el,ix)=>{
  if(checkFld(dName+'_'+(ix+1))) addfield(dName+'_'+(ix+1));
  return [dName+'_'+(ix+1),el.trim()]; 
})
const rowByRec=r=>({'id':r.id,'fields':Object.fromEntries(write(r.obj))})
console.log(query.map(writer))

const upd=query.map(writer).map(rowByRec)

//Create new fields and write result to table
if (newfields.length) output.text(newfields.length+' new fields will be created');
output.inspect(newfields);
for (let newfld of newfields) await dTable.createFieldAsync(newfld,'singleLineText')
output.text(`Write to table: ${upd.length} rows will be updated`)
output.inspect(upd)
while(upd.length) await dTable.updateRecordsAsync(upd.splice(0,50));
output.text('Done')