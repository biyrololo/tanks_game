var hull_index = 0;
var gun_index = 0;

const menu_tank = new Tank(
    {
        x: canvas.width - 250,
        y: 0
    },
    {
        hull: aviableTanks[hull_index],
        gun: aviableGuns[gun_index]
    },
    1,
    'A',
    avliableHullColors[0],
    teams.enemies,
    1,
    '1',
    100,
    300
)

var width = canvas.width;
var height = canvas.height;

var guns_width = width - 500;

var current_gun = 0;
var current_hull = 0;
var current_color = 0;


const guns = [];

for(let i = 0; i < ALL_GUNS.length; ++i) {
    guns.push(
        new MenuButton(
            {
                x: guns_width/ALL_GUNS.length*i,
                y: 0
            },
            {
                width: guns_width/ALL_GUNS.length-5,
                height: 150
            },
            ()=>{
                current_gun = i;
                menu_tank.setGun(ALL_GUNS[i]);
                changes_functions[ALL_HULLS[i]]();
                p.damageT = CHARACTERISTICS_GUNS[ALL_GUNS[i]].damage;
                p.reload.mTime = CHARACTERISTICS_GUNS[ALL_GUNS[i]].reload_time;
                p.setGun(ALL_GUNS[i]);
            },
            `${srcImg}Color_A/Gun_${ALL_GUNS[i]}.png`
        )
    )
}

const hulls = [];

const changes_functions = {
    '01': ()=>{
        p.countShots=1;
        p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false;  p.reload.mTime = 30; p.damageT = 30; p.isRicochet = false; p.isFreezegun=false;
    },
    '06': ()=>{
        p.countShots=2;
        p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false;  p.reload.mTime = 50; p.damageT = 30; p.isRicochet = false; p.isFreezegun=false;
    },
    '02': ()=>{
        p.reload.t = 0;p.isRicochet = false; p.isTesla=true; p.isFiregun=false; p.isMGun=false; p.MGActive = false; p.isThunder=false; p.damageT=50; p.reload.mTime = 70; p.isFreezegun=false;
    },
    '03': ()=>{
        p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false; p.damageT=30; p.reload.mTime = 200; p.MGActive = false;
    p.isRicochet = true; p.isFreezegun=false;
    },
    '04': ()=>{
        p.reload.t = 0;p.isRicochet = false; p.isTesla=false; p.isFiregun=true; p.isMGun=false; p.MGActive = false; p.isThunder=false; p.damageT=2; p.reload.mTime = 86; p.isFreezegun=false;
    },
    '05': ()=>{
        p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false; p.damageT=17; p.reload.mTime = 180; p.MGActive = false;
    p.isRicochet = false; p.isFreezegun=true;
    },
    '07': ()=>{
        p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=true; p.damageT=50; p.reload.mTime = 70;
        p.isRicochet = false; p.isFreezegun=false; p.MGActive = false;
    },
    '08': ()=>{
        p.reload.t = 0;p.isRicochet = false; p.isMGun=true; p.isFiregun=false; p.isTesla=false; p.isThunder=false; p.damageT=1; p.reload.mTime = 100; p.isFreezegun=false;
    }
}

for(let i = 0; i < ALL_GUNS.length; ++i) {
    hulls.push(
        new MenuButton(
            {
                x: guns_width/ALL_GUNS.length*i,
                y: 180
            },
            {
                width: guns_width/ALL_GUNS.length-5,
                height: 150
            },
            ()=>{
                current_hull = i;
                menu_tank.setHull(ALL_HULLS[i]);
                p.setHull(ALL_HULLS[i]);
                p.health.max = CHARACTERISTICS_HULLS[ALL_HULLS[i]].max_health;
                p.health.cur = CHARACTERISTICS_HULLS[ALL_HULLS[i]].max_health;
                p.speed = CHARACTERISTICS_HULLS[ALL_HULLS[i]].speed;
            },
            `${srcImg}Color_A/Hull_${ALL_HULLS[i]}.png`
        )
    )
}

const colors = [];

for(let i = 0; i < ALL_COLORS.length; ++i) {
    colors.push(
        new MenuColorButton(
            {
                x: guns_width/ALL_COLORS.length*i,
                y: 360
            },
            {
                width: guns_width/ALL_COLORS.length-5,
                height: 150
            },
            ()=>{
                if(current_color === i) return
                current_color = i;
                menu_tank.hullColor = ALL_COLORS[i].code;
                menu_tank.setGun(ALL_GUNS[current_gun]);
                menu_tank.setHull(ALL_HULLS[current_hull]);
                p.hullColor = ALL_COLORS[i].code;
                p.setGun(ALL_GUNS[current_gun]);
                p.setHull(ALL_HULLS[current_hull]);
            },
            ALL_COLORS[i].color
        )
    )
}

function draw_choose_gun(){
    for(let i = 0; i < guns.length; ++i) {
        guns[i].draw(current_gun === i);
    }
}

function draw_choose_hull(){
    for(let i = 0; i < hulls.length; ++i) {
        hulls[i].draw(current_hull === i);
    }
}

function draw_choose_color(){
    for(let i = 0; i < colors.length; ++i) {
        colors[i].draw(current_color === i);
    }
}

const start_game_btn = new Btn(
    {
        x: guns_width / 2 - 300,
        y: canvas.height - 100
    },
    {
        width: 600,
        height: 50
    },
    'start game',
    {bg:'#767676',text:'#F2F2F2', bottom: '#303030',hover:'#4A4A4A', img: '#ABDFCE'},
    {name: 'Joystix', size: 40},
    () => {
        gameState = gameStates.active
    }
)

function renderStartMenu() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#4D9262';
    c.fillRect(0, 0, canvas.width, canvas.height);
    let _width = guns_width;
    c.fillStyle = '#0C220D'
    c.fillRect(0, 0, _width, height)
    menu_tank.isMove = 1;
    menu_tank.draw(
        {
            pos: {
                x: canvas.width / 2,
                y: 0
            }
        }
    )
    draw_choose_gun();
    draw_choose_hull();
    draw_choose_color();
    start_game_btn.draw();
    renderControls(c);
}