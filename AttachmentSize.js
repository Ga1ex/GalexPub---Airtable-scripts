//Sum of all attachments. Galex 2023. Define functions:
const inMb=bytes=>bytes? `${Math.round(bytes/Math.pow(1024,2))} Mb`:''
const flds=table=>table.fields.filter(fld=>fld.type.includes('Attach'));
const sum=arr=>!arr? null:{size:arr.filter(n=>n).map(x=>x.size).reduce((x,y)=>x+y,0)}
const count=async tbl=>await tbl.selectRecordsAsync({fields:flds(tbl)}).then(q=>
sum(flds(tbl).flatMap(fl=>q.records.map(x=>x.getCellValue(fl)).map(sum))));
//Start count, all tables * all attach fields * all records * all docs in cell
const ts=await Promise.all(base.tables.map(count))
const total=ts.map((el,ix)=>[base.tables[ix].name,inMb(el.size)]).filter(t=>t[1])
console.log(Object.fromEntries([...total,['TOTAL: ',inMb(sum(ts)?.size)]]))