const ARCH=base.getTable('Compress')
const table=base.getTable('Rhea Data')
const fld=num=>`Content_${num}`
const MLT='multilineText'
var column=1; var accum=0
const archID=await base.createTableAsync(ARCH,[{name:'Name',type:'singleLineText'},
{name:'Content_1',type:MLT}])
const archive=base.getTable(archID);
const crt=await archive.createRecordAsync({"Name":table.name});
const fieldnames=table.fields.map(f=>f.name.toString())
const query=await table.selectRecordsAsync({fields:table.fields})
const row=r=>fieldnames.map(f=>[f,r.getCellValue(f)])
const content=r=>Object.fromEntries([['id',r.id],['recordname',r.name],...row(r)])
const jrow=rec=>JSON.stringify(content(rec))
var datax=[]; var creator=''; var upd=[]
//const update=(n, val)=>({'id':crt,'fields':{fld(n):val}})
for(let rec of query.records){
accum+=jrow(rec).length
datax.push({[rec.id]:jrow(rec)});
if (accum>70000) {
    let writer=JSON.stringify({[`${datax.length}records`]:datax})
    upd.push({[fld(column)]:writer});
    datax=[];column++;accum=0;
    //await archive.createFieldAsync(fld(column),MLT);
    }
}
output.inspect(upd)
output.text(JSON.stringify(upd).length)