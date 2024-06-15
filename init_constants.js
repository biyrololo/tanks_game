
const ALL_GUNS = ['01', '02', '03', '04', '05', '06', '07', '08'];

const ALL_HULLS = ['01', '02', '03', '04', '05', '06', '07', '08'];

const ALL_COLORS = [
    {
        code: 'A',
        color: '#78574C'
    },
    {
        code: 'B',
        color: '#78714C'
    },
    {
        code: 'C',
        color: '#487370'
    },
    {
        code: 'D',
        color: '#4A5775'
    }
]

function getKeyName(key_code){
    let key_name = String.fromCharCode(key_code);
    if(key_code === '37') {
        key_name = 'LEFT';
    }
    if(key_code === '39') {
        key_name = 'RIGHT';
    }
    if(key_code === '38') {
        key_name = 'UP';
    }
    if(key_code === '40') {
        key_name = 'DOWN';
    }
    if(key_code === '32') {
        key_name = 'SPACE';
    }

    return key_name;
}

/**
 * 
 * @type {{[key: string]: {key_code: string; key_name: string, title: string}}}
 */
const CONTROLS = {
    forward: {
        key_code: '87',
        key_name: 'w',
        title: '🠕'
    },
    backward: {
        key_code: '83',
        key_name: 's',
        title: '🠗'
    },
    left: {
        key_code: '65',
        key_name: 'a',
        title: '🠔'
    },
    right: {
        key_code: '68',
        key_name: 'd',
        title: '🠖'
    },
    fire: {
        key_code: '32',
        key_name: 'space',
        title: '🔥'
    },
    rotateLeft: {
        key_code: '37',
        key_name: 'left',
        title: '⤹'
    },
    rotateRight: {
        key_code: '39',
        key_name: 'right',
        title: '⤸'
    }
}

for(let key of Object.keys(CONTROLS)){
    let key_code = localStorage.getItem(key);
    if(key_code){
        CONTROLS[key].key_code = key_code;
        CONTROLS[key].key_name = getKeyName(key_code);
    }
}