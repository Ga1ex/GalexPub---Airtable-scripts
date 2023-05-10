let config = input.config({title: 'Match probability',   
    items: [input.config.table('xtable',{label:'Select table:'}),
        input.config.field('f1', {label: 'Field #1',parentTable: 'xtable'}),
        input.config.field('f2', {label: 'Field #2',parentTable: 'xtable'}) ] });
const {f1,f2}=config;
const space=fn=>fn.name.includes(' ')? '{'+fn.name+'}':fn.name
const fname=n=>n.type.includes('multiple')? 'CONCATENATE('+space(n)+')':space(n)
const [fname1,fname2]=[fname(f1),fname(f2)]
output.text(`Formula to copy-paste: \n`)
output.text(`IF(${fname1},0.2*ROUND((
(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*'),TRIM(UPPER(${fname2})))>0)+
(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*$'),TRIM(UPPER(${fname2})))>0)+
(LEN(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1}))),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*'),''),'[^ ]{3,20}')),'',
REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1}))),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*'),''),'[^ ]{3,20}')))>2)*(FIND(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1}))),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*'),''),'[^ ]{3,20}')),'',
REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname1}))),' '&REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname1}))),'[^ ]*'),''),'[^ ]{3,20}')),TRIM(UPPER(${fname2})))>0)
+
(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*'),TRIM(UPPER(${fname1}))))>0)+
(FIND(REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*$'),TRIM(UPPER(${fname1}))))>0)+
(LEN(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname2})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*'),''),'[^ ]{3,20}')),'',
REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname2})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*'),''),'[^ ]{3,20}')))>2)*(FIND(IF(ISERROR(REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname2})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*'),''),'[^ ]{3,20}')),'',
REGEX_EXTRACT(SUBSTITUTE(SUBSTITUTE(TRIM(UPPER(${fname2})),' '&REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*$'),''),
REGEX_EXTRACT(TRIM(UPPER(${fname2})),'[^ ]*'),''),'[^ ]{3,20}')),TRIM(UPPER(${fname1}))))>0)
) * (
1-0.2*((LEN(TRIM(${fname1})))-LEN(SUBSTITUTE(TRIM(${fname1})),' ',''))>1)*(LEN(TRIM(${fname2}))-LEN(SUBSTITUTE(TRIM(${fname2}),' ',''))>1))
)))
`)