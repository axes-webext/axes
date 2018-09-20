{
    function reduce (head, tail) {
        return tail.reduce(function(result, element) {
            result.push(element[1]);
            return result;
        }, [head]);
    }

    function addDefault (commands) {
        if (commands.length === 0) {
            return [{ modifier: '', args: []}];
        } else {
            return commands;
        }
    }

    function exclude (min, sub) {
        if (sub.type === 'exclude') {
            sub = [sub.min, sub.sub];
        }
        return { min, sub, type: 'exclude' };
    }
}

start
    = _? head:action tail:(_ action)* _?                  { return reduce(head, tail); }
    / _? { return []; }

_ = [\n\r ]+

action
    = t:target c:commands                                 { return { commands: addDefault(c),
                                                                     target: t }; }
    / c:commands t:target                                 { return { commands: addDefault(c),
                                                                      target: t }; }
    / c:commands1                                         { return { commands: addDefault(c),
                                                                     target: { type: 'none' } }; }

commands
    = cs:(modifier argument*)*                            { return cs.map(([mod, args]) => ({ modifier: mod,
                                                                                              args: args })); }

commands1
    = cs:(modifier argument*)+                            { return cs.map(([modifier, args]) => ({ modifier, args })); }

modifier
    = [!@#$%^&*_+\-=~";:\\|/?.><,]
    / '`' x:[a-z0-9]+ '`'                                 { return x.join(''); }

target
    = value:label                                         { return { type: 'label', value: value }; }
    / '[' value:intervals ']'                             { return { type: 'intervals', value: value }; }
    / value:selectors1                                    { return { type: 'selectors', value: value }; }

intervals
    = head:excludes tail:(',' excludes)*                  { return reduce(head, tail); }

excludes
    = head:interval tail:('\\' (pattern / interval))*     { return tail.map(e => e[1]).reduce((e, acc) => {
                                                              return { type: 'exclude', min: e, sub: acc };
                                                            }, head); }

interval
    = '(' intervals:intervals ')'                         { return         intervals; }
    / from:label '-' to:label                             { return         { type: 'interval', from, to }; }
    / label

pattern
    = patterns:pattern1+                                  { return { pattern: [].concat(...patterns), type: 'pattern' }; }
    / '\\' n:int                                          { return { pattern: [true, ...new Array(n).fill(false)],
                                                                     type: 'pattern' }; }

pattern1
    = plusminus:('+' / '-')+ num:[0-9]*                   { let r = [];
                                                            plusminus.forEach(e => r.push(e == '+'));
                                                            if (num.length) {
                                                              r = r.concat(new Array(parseInt(num.join(''))).fill(r.pop()));
                                                            }
                                                            return r; }

selectors1 = '{' r:selectors '}'                          { return r; }

selectors
    = head:selector
      tail:('\\' (pattern / selector))*                   { return tail.map(e => e[1]).reduce((min, sub) => {
                                                              return { type: 'exclude', min, sub };
                                                            }, head); }

selector
    = '(' r:selectors ')'                                 { return r; }
    / xs:[^|}\\]+ patterns:('|' selpattern)?              { return { type: 'selector',
                                                                     value: xs.join(''),
                                                                     patterns: patterns ? patterns[1] : null }; }

selpattern
    = head:selpattern1 tail:(',' selpattern1)*            { return reduce(head, tail); }

selpattern1
    = from:int '-' to:int                                 { return { type: 'interval', from, to }; }
    / value:int                                           { return { type: 'number', value }; }

label
    = chars:[a-z0-9]+                                     { return chars.join(''); }

int = [0-9]+                                              { return parseInt(text(), 10); }

argument = "'" tokens:(("\\" "'") / ("\\" "\\") / [^\\'])* "'"
                                                          { return tokens.map(e => e instanceof Array ? e[1] : e)
                                                                         .join(''); }
