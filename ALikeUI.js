const config = input.config({title: 'Find best match',items:[
    input.config.table('table', {label: 'Select table'}),
    input.config.field('myfield', {label: 'Select field',parentTable: 'table'}),
    input.config.text('mytext',{label:'input text'})
    ]})
const {table,myfield:{name:field},mytext:text}=config;
const txtarr=[...new Set(text.split(' '))]
const reSet=x=>new Set(x.split(' '));
const sets=r=>[...txtarr,...reSet((r.getCellValueAsString(field)||''))]
const likeness=arr=>(arr.length-(reSet(arr.join(' '))).size)/arr.length
const compare=rec=>likeness(sets(rec))
const query=await table.selectRecordsAsync({fields:[field]});
const index=arr=>arr.indexOf(Math.max(...arr));
const val=query.records[index(query.records.map(compare))].getCellValueAsString(field);
output.text(val)