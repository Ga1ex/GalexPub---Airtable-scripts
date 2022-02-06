// ALike. galex2022.  arr coef 2-100%,3-75%,4(default)-51%
let mainTable = base.getTable('Orders'); 
const [fld1,fld2,result]=['addr','addr','addr']
const updateLink=(ord,m)=>({id:ord.id,fields:{result:arr(compare(fld1,fld2))}}) 
const words=w=>query.records.getCellValue(w).split(' ')
const compare=(x,y)=>[...words(x),...words(y)]
const arr=a=>4*(a.length-(new Set(a)).size)>a.length? 'Y':'N' ;
let query = await mainTable.selectRecordsAsync({fields:[mainField]});
let updates=query.records.map(updateLink);
while(updates.length) await mainTable.updateRecordsAsync(updates.splice(0,50))