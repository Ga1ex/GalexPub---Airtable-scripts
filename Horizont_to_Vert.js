// Horizont to vert. Horizont_row 0, Horiz.. 1, horiz.. 2 rotated to V_row, num. Galex 2022
const H_TABLE = base.getTable('horizont table'); 
const V_TABLE = base.getTable('vert table');
const UW=['left side','left_','side'];
const [SO,MS]=['V_table_column Info','Horizont_row '];
const num=n=>Number(n.slice(MS.length-n.length));
const onum=own=>own.name.toString(); 
const OWNERS=H_TABLE.fields.filter(f=>f.name.includes(MS)).map(onum).sort((x,y)=>num(x)-num(y));

const leftside=rec=>UW.map(f=>[f,rec.getCellValue(f)]);
const owners=rec=>OWNERS.map(o=>rec.getCellValue(o)).filter(n=>n);
const create=(rc)=>owners(rc).map((ow,ix)=>({fields:Object.
    fromEntries([...leftside(rc),[SO,ow],['num',ix],['Link',[{id:rc.id}]]])}))
const query = await H_TABLE.selectRecordsAsync({fields:H_TABLE.fields});
const crt=query.records.flatMap(create);
while(crt.length) await V_TABLE.createRecordsAsync(crt.splice(0,50))