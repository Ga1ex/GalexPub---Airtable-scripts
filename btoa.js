function encodeToBase64(str) {
    const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    
    for (let i = 0; i < str.length; i += 3) {
    const group = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
    
    result +=
    base64Chars.charAt((group >> 18) & 63) +
    base64Chars.charAt((group >> 12) & 63) +
    base64Chars.charAt((group >> 6) & 63) +
    base64Chars.charAt(group & 63);
    }
    
    return result;
    }
    
    const btoa=(str,out=[])=>{  //Function splits char codes to binary, each 6 bits => char from base64
     let base64 ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
     let fillto8=bits=>'0'.repeat(8-bits.length)+bits
     let arr=[...(str+String.fromCharCode(0).repeat(str.length%3*2%3))] //add junk to be divided by 3
     let char2bits=[...arr.map(v=>fillto8(Number(v.charCodeAt(0)).toString(2))).join('')]
     while(char2bits.length) out.push(base64[Number.parseInt(char2bits.splice(0,6).join(''),2)])
     let result=['='.repeat(out.splice(-str.length%3*2%3).length),out.join('')].reverse().join('') 
     return result
    }
    
    console.log(encodeToBase64('1234'))
    console.log(btoa('1234'))
    
    
    