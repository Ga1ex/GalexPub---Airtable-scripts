//Factorization (find large multipliers)

const gcd=(a, b)=>{ while(b) [a, b] = [b, a % b]; return a}
function pollardsRho(n) {
  if (n % 2 === 0) return 2;
  let [x,y,c,d] = [2,2,1,1]
    while (d === 1) {
     x = (x * x + c) % n;
     y = (y * y + c) % n;
     y = (y * y + c) % n;
     d = gcd((x > y ? x - y : y - x), n);
     if (d === n) return pollardsRho(n); // retry
    }    return d;
}
// Example usage
let N = 3996465028398169; // <- BigInt
let N3 = 55070371515547
let p = pollardsRho(N);
let q = N / p;
console.log(`Factors: ${p} × ${q}`);
