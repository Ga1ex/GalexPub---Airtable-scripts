const linkWebhook='https://hooks.airtable.com/workflows/v1/genericWebhook/appBASEID/SomeNumbersLetters'
const basetables=base.tables.map(t=>t.name.toString)
let payload={'base':base.name,'tables':basetables,'total':JSON.stringify(base)};
const baselen=payload.total.length;
if (baselen>1e5) throw new Error(`Base schema size ${baselen} exceeds 100k limit, cancelled.. `);
   else {
const options={
  method:'POST',
  body: JSON.stringify(payload),
  headers:{'Content-Type': 'application/json'}
  }
const responce=await remoteFetchAsync(linkWebhook,options);
const result=(responce.ok)? await responce.json() : responce.statusText;
output.inspect(result)
}
