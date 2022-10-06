const config = input.config({title: 'Levenstein',items:[
    input.config.table('table1', {label: 'Select table 1'}),
    input.config.view('myview', {label:'Select view', parentTable:'table1'}),
        input.config.field('field0', {label: 'Search which dataa',parentTable: 'table1'}),
    input.config.field('field1', {label: 'Fill which field',parentTable: 'table1'}),
    input.config.table('table2', {label: 'Select table 2'}),
    input.config.field('myfield', {label: 'Select field to seek',parentTable: 'table2'}),
    input.config.field('display', {label: 'Result Field',parentTable: 'table2'})
    ]})
const {table1,myview,field0,field1,table2,myfield:{name:field2},display}=config;
const qtext=await myview.selectRecordsAsync({fields:[field0]})
output.inspect(qtext.records)


let levD = function(a, b){
    if(!a || !b) return (a || b).length;
    var m = [];
    for(var i = 0; i <= b.length; i++){
        m[i] = [i];
        if(i === 0) continue;
        for(var j = 0; j <= a.length; j++){
            m[0][j] = j;
            if(j === 0) continue;
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(
                m[i-1][j-1] + 1,
                m[i][j-1] + 1,
                m[i-1][j] + 1
            );
        }
    }

    return m[b.length][a.length];
};

// max string length function (gets the max length of two strings)
let maxlen = function(a, b){
    return Math.max(a.length, b.length);
};

let upd=[]


for (var r1 of qtext.records) {
let name1=r1.getCellValueAsString(field0)
const norm=x=>x.toUpperCase().split(' ').map(m=>m.replace(/W/,'')).sort().join(' ')
const query=await table2.selectRecordsAsync({fields:[field2,display]});
const vals=z=>[norm(name1),norm(z.getCellValueAsString(field2))]
const compare=rec2=>(1-levD(...vals(rec2))/maxlen(...vals(rec2)));

var auto=''; var match=''
let result=query.records.filter(r=>compare(r)>0.2).sort((a,b)=>(compare(b)-compare(a)))
if (result.length>10) result=result.slice(0,5)
const resultTab=result.map(x=>({'Name':x.getCellValue(field2),'Match%':Math.round(10000*compare(x))/100+' %',[display.name]:x.getCellValue(display)}))
if (compare(result[0])<0.7) {
const opts=result.map(r=>r.getCellValueAsString(field2))
output.table(resultTab)
output.text(`${1+qtext.records.indexOf(r1)} of ${qtext.records.length}`)
const ask=await input.buttonsAsync(`Choose match for ${name1} :`,opts)
match=resultTab.find(x=>x.Name==ask)?.[display.name]||''
} else {auto=resultTab[0][display.name]};
let value=auto? auto:match;
await table1.updateRecordAsync(r1.id,{[field1.name]:value})
output.text('Saved'); output.clear;
} //next rec1

