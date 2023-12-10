//Sum of all attachments. Galex 2023
const inMb=bytes=>bytes? `${Math.round(bytes/Math.pow(1024,2))} Mb`:''
const flds=table=>table.fields.filter(fld=>fld.type.includes('Attach'));
const sum=a=>!a? null:{size:a.filter(n=>n).map(x=>x.size).reduce((x,y)=>x+y,0)}
const count=async tbl=>await tbl.selectRecordsAsync({fields:flds(tbl)}).then(q=>
sum(flds(tbl).flatMap(fl=>q.records.map(x=>x.getCellValue(fl)).map(sum))));

const ts=await Promise.all(base.tables.map(count))
const total=ts.map((el,ix)=>[base.tables[ix].name,inMb(el.size)]).filter(t=>t[1])
output.inspect(Object.fromEntries([...total,['TOTAL: ',inMb(sum(ts)?.size)]]))