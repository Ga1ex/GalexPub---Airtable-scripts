// ALike. galex2022. Check text fuzzy match. arr coef 2-100%,3-75%,4(default)-51%
const mainTable = base.getTable('ANYTABLE'); 
const [fld1,fld2,result]=['compare1','compare2','result']
const updateLink=(ord,m)=>({id:ord.id,fields:{result:arr(compare(fld1,fld2))}}) 
const words=w=>query.records.getCellValue(w).split(' ')
const compare=(x,y)=>[...words(x),...words(y)]
const arr=a=>4*(a.length-(new Set(a)).size)>a.length? 'Y':'N' ;
const query = await mainTable.selectRecordsAsync({fields:[mainField]});
const updates=query.records.map(updateLink);
while(updates.length) await mainTable.updateRecordsAsync(updates.splice(0,50))