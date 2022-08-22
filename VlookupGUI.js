// galex,2022. Set table and field names
let settings = input.config({
    title: 'Vlookup',
    description: 'You need to define two tables, fields to set link and link field. Second table/link autodetected',
    items:[input.config.table('tableOne', {label: 'Select first table' }),
           input.config.field('joinField',{label: 'Select field to join',parentTable:'tableOne'})]
})
const {tableOne,joinField}=settings

//Define other table and fields
let linkFields = tableOne.fields.filter(f=>f.type.includes('RecordLinks'));
if(!linkFields.length) throw new Error (`No link fields in ${tableOne}`);
let chooseField=(linkFields.length>1)? 
await input.buttonsAsync('Choose linkfield:',linkFields.map(f=>f.name)):linkFields[0].name
const LINK=tableOne.getField(chooseField);
// @ts-ignore
const SECTABLE=base.getTable(LINK.options?.linkedTableId);
let sameName=SECTABLE.fields.find(f=>f.name===joinField.name);
let fld=(sameName)? sameName.name :await input.buttonsAsync(`Field ${joinField.name} absent in ${SECTABLE}.Choose:`,
SECTABLE.fields.filter(f=>!f.type.includes('RecordLinks')).map(f=>f.name));
const FIELD_TWO=SECTABLE.getField(fld)

//Read data, define target scope
const queryMain = await tableOne.selectRecordsAsync({fields:[joinField,LINK]});
let querySec = await SECTABLE.selectRecordsAsync({fields:[FIELD_TWO]});
const query=queryMain.records.filter(r=>!r.getCellValue(LINK))
output.text(`Total records: ${queryMain.records.length}, empty records: ${query.length}`)
const ask=await input.buttonsAsync(`Update only empty links or update all?`,['Empty','All'])
const upd=(ask=='All')? queryMain.records : query

//Build map of second table values to boost script perfomance
const val=x=>x.getCellValue(FIELD_TWO)
let valtable=querySec.records.reduce((acc,v)=>acc.set(val(v),[...acc.get(val(v))||[],v.id]),new Map())
const updateLink=(rec,m)=>({id:rec.id,fields:{[LINK.name]:m.map(x=>({'id':x}))}}) 

//Process and write
let updates=upd.map(rec=>updateLink(rec,valtable.get(rec.getCellValue(joinField))||[]))
while(updates.length) tableOne.updateRecordsAsync(updates.splice(0,50))