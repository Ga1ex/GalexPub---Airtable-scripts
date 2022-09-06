const check=value=>(value!=value.trim()) //untrimmed
const checkname='untrimmed'

const word=await input.textAsync('Type field name or its part: ')
const flds=t=>t.fields.filter(f=>(f.name.toUpperCase().includes(word.toUpperCase()))&&(f.type.includes('Text')));
const TABLES=base.tables; output.text('To check:')
const tocheck=TABLES.flatMap(t=>flds(t).map(f=>({'table':t.name,'field':f.name})))
tocheck.length? output.table(tocheck) : output.text('Nothing')
for (let tbl of TABLES) for (let fld of flds(tbl)) await checkfld(tbl,fld);

async function checkfld(t,f){
  let query=await t.selectRecordsAsync({fields:[f]}).then(output.text(`Checking ${t.name}/${f.name}`))
  let checked=query.records.filter(r=>check(r.getCellValueAsString(f)))
  output.text(`Total: ${query.records.length}, ${checkname}: ${checked.length}`);
  return;}

