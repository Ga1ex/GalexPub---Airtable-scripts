const table=base.getTable() //set table name here
const [FLD1,FLD2]=['Field1','Field2'] //set field names
const query=await table.selectRecordsAsync({fields:[FLD1]}) //set fields to read data
const example=value=>value.split('').reverse().join('') //sample function - reverse word
const nonempty=r=>r.getCellValue(FLD1)!==null
const update=r=>({id:r.id,fields:{[FLD2]: example (r.getCellValue(FLD1))}})
const upd=query.records.filter(nonempty).map(update)
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))
