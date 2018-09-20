/** This function returns object containing flag states on specified character

   eg.                   |
                         V
   getParserStateAt ("a 'bc'", 3) =
       { string: true,
         escape: false }
*/
module.exports = function getParserStateAt (str, at) {
    let string = false, escape = false;

    for (let i = 0; i < str.length && i <= at; i++) {
        let c = str[i];

        if (string) {
            if (escape) {
                escape = false;
            } else {
                if (c === "'") {
                    string = false;
                } else if(c === "\\") {
                    escape = true;
                }
            }
        } else {
            if (c === "'") {
                string = true;
            }
        }
    }

    return { string, escape };
}
