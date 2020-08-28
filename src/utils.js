export function add(a, b) {
  console.log('add method')
  return a + b
}


export function urlEncode(param,key,encode){
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (Array.isArray(param) ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;


}