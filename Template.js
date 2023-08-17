const table=base.getTable() //set table name here
const [FLD1,FLD2]=['Field1','Field2'] //set field names
const query=await table.selectRecordsAsync({fields:[FLD2]}) //set fields to read data
const example=value=>value.split('').reverse().join('') //sample function - reverse word
const update=r=>({id:r.id,fields:{FLD1:example(r.getCellValue(FLD2))}})
const upd=query.map(update)
while (upd.length) await table.updateRecordsAsync(data.splice(0,50))