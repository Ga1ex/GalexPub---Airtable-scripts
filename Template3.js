const [FLD1,FLD2,...tables]=['Field1','Field2','Table1','Table2'] //field&table names
const [TAB1,TAB2]=tables.map(t=>base.getTable(t))
const query=await TAB1.selectRecordsAsync({fields:[FLD1]}) //set fields to read data
const example=value=>value.split('').reverse().join('') //sample function - reverse word
const nonempty=r=>r.getCellValue(FLD1)!==null
const update=r=>({id:r.id,fields:{[FLD2]: example (r.getCellValue(FLD1))}})
const upd=query.records.filter(nonempty).map(update)
while (upd.length) await TAB2.updateRecordsAsync(upd.splice(0,50))
