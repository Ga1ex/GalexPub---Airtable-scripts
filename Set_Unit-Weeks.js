const config = input.config({title: 'Create unit-week list',items:[
    input.config.table('table', {label: `Select table. Change 'const names' in code to get other fieldnames`}),
        input.config.text('units',{label:`define unit list, like '100-120,140,250-270' `})   ]})
const {table,units}=config
const names=['unit','week','unitweek']; 
const fields=(arr)=>Object.fromEntries(names.map((n,ix)=>[n,arr[ix]]))
const ids=names.map(f=>{table.fields.map(tf=>tf.name).includes(f)? table.getField(f):table.createFieldAsync(f,'singleLineText')})
const range=(a,b)=>new Array(++b-a).fill(a).map((c,ix)=>(Number(c)+ix).toString())
const arr=units.split(',').flatMap(u=>u.includes('-')? range(...u.split('-',2)):u)
const uniq=[...new Set(arr)];output.inspect(uniq)
const crt=uniq.flatMap(u=>range(1,52).map(w=>({fields:{...fields([u,w,u+'-'+w])}})))
let ask=await input.buttonsAsync(`${crt.length} rows will be created, confirm?`,['Yes','No'])
if (ask=='Yes') while (crt.length) await table.createRecordsAsync(crt.splice(0,50))