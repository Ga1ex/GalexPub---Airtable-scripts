//galex 2025 Ver 3.0 ask to add HOA
let config = input.config({title: 'Match probability 3.0',   
    items: [input.config.table('xtable',{label:'Select table:'}),
        input.config.field('f1', {label: 'Field #1',parentTable: 'xtable'}),
        input.config.field('f2', {label: 'Field #2',parentTable: 'xtable'}),
        input.config.field('f3', {label: 'Secondary field #2. formula compares with both, returns MAX. To omit, select same as #2',parentTable: 'xtable'}), ] });
const {xtable,f1,f2,f3}=config;

let addhoa='NO'
const fnames=[f1,f2,f3].map(f=>f.name)
const TOP3=arr=>arr.sort((a,b)=>b[1]-a[1]).slice(0,3)
const query=await xtable.selectRecordsAsync({fields:[f1,f2,f3].map(f=>f.name)})
const values=fld=>query.records.map(r=>r.getCellValueAsString(fld)).filter(Boolean)
const group=f=>TOP3([...values(f).reduce((a,v)=>a.set(v,1+a.get(v)||0),new Map()).entries()])
let hoa1=group(f1);  let hoa2=f2.name==f3.name? group(f2):TOP3([...group(f2),...group(f3)])
const freq=[hoa1[0],hoa2[0]].map(h=>h[1])
const hoas=[hoa1,hoa2].map(h=>h[0])
//console.log({hoa1,hoa2}) ; console.log({freq,hoas})

const Perc5=arr=>arr.every(x=> 2*query.records.length/100 < x ) // 2 percent to add HOA names
if(hoas&&Perc5(freq)) {
    console.log(`Most frequent values \n ${f1.name}:`)
    output.table(hoa1) ; console.log(f2.name+' / '+f3.name); output.table(hoa2)
    const ask=await input.buttonsAsync(`Do you want to add pair as 100% ?`,['YES','NO'])
    const select=async (arr,s)=>await input.buttonsAsync(`Select ${s} side`,arr.map(a=>a[0]))
    if(ask=='YES'){ addhoa='YES' ; hoa1=await select(hoa1,'left') ; hoa2=await select(hoa2,'right')}
}

const space=fn=>fn.name.includes(' ')? '{'+fn.name+'}':fn.name
const fname=n=>n.isComputed? 'CONCATENATE('+space(n)+')':space(n)
const [fname1,fname2,fname3]=[fname(f1),fname(f2),fname(f3)]
output.text(`Formula to copy-paste: \n`)
const formula=xname=>`IF(AND(${fname1},${xname}),0.2*ROUND(((FIND(REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*'),TRIM(UPPER(${fname1})))>0)+(FIND(REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*$'),TRIM(UPPER(${fname1})))>0)+(LEN(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${xname})),' '&REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*'),''),'[^ ]{3,20}')),'',REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${xname})),' '&REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*'),''),'[^ ]{3,20}')))>2)*(FIND(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${xname})),' '&REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*'),''),'[^ ]{3,20}')),'',REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${xname})),' '&REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${xname})),'[^ ]*'),''),'[^ ]{3,20}')),TRIM(UPPER(${fname1})))>0)+(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*'),TRIM(UPPER(${xname})))>0)+(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*$'),TRIM(UPPER(${xname})))>0)+(LEN(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*'),''),'[^ ]{3,20}')),'',REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*'),''),'[^ ]{3,20}')))>2)*(FIND(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*'),''),'[^ ]{3,20}')),'',REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*$'),''),REGEX_EXTRACT(TRIM(UPPER(${fname1})),'[^ ]*'),''),'[^ ]{3,20}')),TRIM(UPPER(${xname})))>0)) * (1-0.2*((LEN(TRIM(${xname}))-LEN(SUBSTITUTE(TRIM(${xname}),' ',''))>1)*(LEN(TRIM(${fname1}))-LEN(SUBSTITUTE(TRIM(${fname1}),' ',''))>1)))))`
const hoa=f=>addhoa=='YES'? `IF(AND(${fname1}="${hoa1}",${f}="${hoa2}"),1,${formula(f)})`:formula(f)
const result=fname2==fname3? hoa(fname2):
`IF(AND(${fname1},OR(${fname2},${fname3})),MAX(\n${hoa(fname2)} \n,\n ${hoa(fname3)}\n))`
output.text(result)