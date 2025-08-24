//Tokenizer
function tokenizer(input) {
    //pointer to track position
    let current = 0;
    //save tokenized content
    let tokens = [];

    while (current < input.length) {
        //store current char in input
        let char = input[current];
        let WHITESPACE = /\s/;

        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }
        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '(',
            })
            //increment our pointer
            current++;

            continue;
        }
        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            })
            //increment our pointer
            current++;

            continue;
        }
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            let value = '';

            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({ type: 'number', value });

            continue;
        }
        if (char === '"') {
            let value = ''

            char = input[++current];


            while (char != '"') {
                value += char;
                char = input[++current];
            }

            char = input[++current];
            tokens.push({
                type: 'string',
                value
            });
            continue;
        }
        let LETTERS = /[a-z]/i;
        if(LETTERS.test(char)){
            let value=''

            while (LETTERS.test(char)){
            value+=char;
            char = input[++current];}

            tokens.push({
                type:'name', value
            })

            continue;
        }

        throw new TypeError('I dont know what character this is' + char);
        

    }
    return tokens;
}

function parser(tokens){
    let current = 0;

    function walk(){

        let token = tokens[current];

        if (token.type === 'number'){
            current++;

            return{
                type: 'NumberLiteral',
                value:token.value,
            };
        }

        if (token.type === 'string'){
            current++;

            return{
                type: 'StringLiteral',
                value: token.type,
            }
        }

        if(token.type==='paren' && token.value==='('){
            token = tokens[++current];

            let node ={
                type: 'CallExpression',
                name: token.value,
                params:[],
            };
            //ignore parenthesis  

            token = tokens[++current];

            while(token.type!='paren' || (token.type==='paren' && token.value==='(')){
                node.params.push(walk())
                token = tokens[current];

            }

            current++;

            return node;
        }

        throw new TypeError(token.type);
    }
    let ast = {
        type: 'Program',
        body: [],
    };

    while(current<tokens.length){
        ast.body.push(walk());
    }

    return ast;

}