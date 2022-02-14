//Check all fields containing Word. Displays triling spaces. Galex 2021
const WORD='someword' 

const TABLES=base.tables; var current;
for (let tbl of TABLES) {
  let table=base.getTable(tbl.id); current=tbl;
  let checkFields=table.fields.filter(f=>(f.name.toUpperCase().
  includes(WORD.toUpperCase()))&&
  (f.type.includes('Text')));
  for (let fld of checkFields) await check(fld);
}

async function check(fld){
  let query=await current.selectRecordsAsync({fields:[fld]}).then()
  output.text(`Checking ${current.name}/${fld.name}`);
  let extraSpaces=query.records.filter(r=>
  r.getCellValueAsString(fld)!=r.getCellValueAsString(fld).trim())
  output.text(`Total: ${query.records.length}, wrong:${extraSpaces.length}`);
  return;
}