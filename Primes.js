//const isPrime=(x,div=Math.round(x**0.5))=>{ while(x%div){div--}; return !--div }
const begin=Date.now()
const timer=txt=>console.log(`${(Date.now()-begin)/1000} ms ${txt}`)
timer('Script started')

//using Rosser-Schoenfeld's inequality to get place of sqrt(n) in array of n primes
//at first I didn't know about it, so I created my own formula. Works, but possibly slower than R-S on >10e6
const gusser=n=>(Math.sqrt(n)+n**Math.exp(-1))/2 + (n<50000? 3:0)

const rosser=(n,s=Math.sqrt(n*Math.log(n)+Math.log(Math.log(n))))=>1.255*s/Math.log(s)
const rs_primes=(n,arr=[],max=rosser(n))=>{ 
for(let i=2;arr.length<n;i++) if(arr.slice(0,max).every(j=>i%j)) arr.push(i);
return arr}


const fast_primes=(n,arr=[],max=(Math.sqrt(n)+n**Math.exp(-1))/2 + (n<50000? 3:0))=>{ 
for(let i=2;arr.length<n;i++) if(arr.slice(0,max).every(j=>i%j)) arr.push(i);
return arr}

//Rosser-Schoenfeld's inequality
const table=base.getTable('test')

/*for(let qty=201;qty<301;qty++) {
  timer(`finding ${qty} primes`)
  const test=qty*1000
  const orey=fast_primes(test)
  const highest=orey.pop()
  const squared=orey.filter(x=>x<Math.sqrt(highest))
  const place=squared.length

  await table.createRecordAsync({test,highest,place})
}
timer('the end') */
const rec=await input.recordAsync('how much primes',table)
const qty=rec?.getCellValue('test')

timer(`finding ${qty} primes`)
const ross=rosser(qty)
const orey=fast_primes(qty)
const highest=orey.pop()
timer('all primes found, the last is '+highest)
if(!rec || !highest || !qty) throw new Error('no number')
const squared=orey.filter(x=>x<Math.sqrt(highest))
console.log(squared)
const place=squared.length
await table.updateRecordAsync(rec,{ross,highest,place})
timer('script done')

