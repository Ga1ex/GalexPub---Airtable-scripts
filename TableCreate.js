const table=base.getTable('TableCreator')
const query=await table.selectRecordsAsync({fields:table.fields})
const [TNAME,FNAMES,FTYPES,COMM]=['Name','Fieldnames','Fieldtypes','Command']
const rec=await input.recordAsync('',table);
const cmd=rec?.getCellValue(COMM);

if ((!cmd)&&(rec)) {
const cutter=text=>text.split('"').join('').split(`\n`).join('')
const tname=rec?.getCellValue(TNAME);
const fnames=cutter(rec?.getCellValue(FNAMES)).split('- ').splice(1);
const ftypes=rec?.getCellValue(FTYPES).map(t=>t.name);
const flds=ftypes.flatMap((t,ix)=>fnames[ix].split(', ').map(fname=>(`{name:'${fname}',type:'${t}'}`)))
const command=`base.createTableAsync('${tname}',[${[flds.join()]}])`
await table.updateRecordAsync(rec,{[COMM]:command})
} else {
const tabID=await remoterun(cmd)
}

async function remoterun(cmd){
    let result=eval(cmd).then(output.text('Table created'))
    return result  }
