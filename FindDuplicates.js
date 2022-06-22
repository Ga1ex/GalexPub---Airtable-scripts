const table=base.getTable('RhAct4test')
const [CHECK,MARK,DUP]=['ZIP','dupstatus','Duplicate']
const query=await table.selectRecordsAsync({fields:[CHECK]})
const values=new Map(query.records.map(rec=>[rec.getCellValue(CHECK),rec.id]))
const others=query.recordIds.filter(id=>(![...values.values()].includes(id))) 
const othervals=new Set(others.map(id=>query.getRecord(id).getCellValue(CHECK)))
const dupes=[...values.keys()].filter(val=>othervals.has(val))
const upd=query.records.filter(r=>dupes.includes(r.getCellValue(CHECK))).map(u=>({'id':u.id,'fields':{[MARK]:DUP}}))
while (upd.length) await table.updateRecordsAsync(upd.splice(0,50))

