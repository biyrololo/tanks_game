//collision with map water-42
"use strict"
const collision = dataC, distStop = 1.5, rotateGunSpeed = 1,
mapZoom = 1.5,
tileSize = 32*mapZoom,
allWidth = 48, allHeight = 48,
collisionBlocks = [], bulletCollisionBlocks = []; //=Data Map
collision.forEach(co=>{
    co.data.forEach((tile, i)=>{
        if(tile != 0)
            {collisionBlocks.push({x: (i%co.width+co.x+16)*32*mapZoom, y: (Math.floor(i/co.width)+co.y)*32*mapZoom})
                if(tile != 42)
                bulletCollisionBlocks.push({x: (i%co.width+co.x+16)*32*mapZoom, y: (Math.floor(i/co.width)+co.y)*32*mapZoom})}
    })
})

class Btn{
    constructor(pos, size, text, color,font, onclick){
        this.state = 1;
        this.pos=pos;
        this.size=size;
        this.text=text;
        this.color=color;
        this.onclick=onclick;
        this.font=font;
        this.drawn={color: color.bg};
        this.shift=0;
        this.hoverParams={value: 0, max: 5, state: 0, lastState: 0, back: false};
    }
    isHover(){
        return (mouse.x>this.pos.x && mouse.x<this.pos.x+this.size.width && mouse.y>this.pos.y && mouse.y  < this.pos.y+this.size.height);
    }
    hover(){
        if(this.hoverParams.back) this.hoverParams.back=false;
        // document.body.style.cursor='pointer';
        this.drawn.color=this.color.hover;
        if(this.hoverParams.state===0) {
            if(this.hoverParams.value<this.hoverParams.max)
            this.hoverParams.value++;
        }
        this.shift=this.size.height*0.1*this.hoverParams.value/this.hoverParams.max;
        if(mouse.click) this.onclick();
    }
    endHover(){
        if(this.hoverParams.value>0)
        {    this.hoverParams.value--;
            this.shift=this.size.height*0.1*this.hoverParams.value/this.hoverParams.max;}
        else{
            this.hoverParams.back=false;
        }
    }
    /**
     * 
     * @param {{x: number; y: number} || undefined} img 
     */
    draw(img=undefined){
        this.shift=0;
        this.drawn.color=this.color.bg;
        this.hoverParams.lastState=this.hoverParams.state;
        if(this.isHover()) this.hover();
        else {if(this.hoverParams.lastState===1 || this.hoverParams.value > 0) this.hoverParams.back=true;
            this.hoverParams.state=0;}
        if(this.hoverParams.back) this.endHover();
        c.fillStyle=this.drawn.color;
        c.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height*0.8+this.shift);
        c.fillStyle=this.color.bottom;
        c.fillRect(this.pos.x,this.pos.y+this.size.height*0.8+this.shift,this.size.width,this.size.height*0.2-this.shift);
        c.fillStyle=this.color.text;
        c.font=`${this.font.size}px ${this.font.name}`;
        c.textAlign='left';
        c.textBaseline='middle';
        if(img){
            c.fillText(this.text,this.pos.x+this.size.height,this.pos.y+this.size.height*0.5+this.shift, this.size.width*0.6);
            c.fillStyle=img;
            c.drawImage(icons, img.x*(ICON_SIZE + 2), img.y*(ICON_SIZE + 2), ICON_SIZE, ICON_SIZE,
                this.pos.x+10, this.pos.y+10, this.size.height*0.8-20, this.size.height*0.8-20);
            // c.fillRect(this.pos.x+10, this.pos.y+10, this.size.height*0.8-20, this.size.height*0.8-20);
        }
        else{
            c.textAlign='center';
        c.fillText(this.text,this.pos.x+this.size.width/2,this.pos.y+this.size.height*0.5+this.shift, this.size.width*0.6);
        }
    }
}
const mTimeRBullets = 100, mTimeFBullets = 60;
const mouse={x:0,y:0, click: false};
const gameStates = {active: 1, chooseGain: 2, pause: 3, start_menu: 4};
var gameState = gameStates.start_menu;
const angleShiftMultishots = 10;
// console.log(collisionBlocks)
const exps = [];
const canvas = document.querySelector("canvas"),
c = canvas.getContext("2d"),
srcImg = 'img/';
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
c.imageSmoothingEnabled = true;
var lastTime = Date.now();
const beginMap = {x: canvas.width*0.1, y: canvas.height*0.1},
endMap = {x: canvas.width*0.9, y: canvas.height*0.9};
const map = new Image();
map.src=`${srcImg}map.png`;
// const hull = new Image(), gun = new Image();
// hull.src=`${srcImg}Hull_01.png`;
// gun.src=`${srcImg}Gun_01.png`;
// const hullSize={w:180,h:200},
// gunSize={w:75, h:150},
// gunRealSize={center:{x: 48, y: 160}},
// realSize = {center:{x:128, y:174}},
// pos = {x: canvas.width/2, y: canvas.height/2}; //-realSize.center.x*hullSize.w/hull.width, -realSize.center.y*hullSize.h/hull.height
var speed = 10, rotateAngle=0, gunAngle = 0, crossHairSize = 100;
var game_time = 0;
var game_time_timer = 0;
const secondPos = {x: canvas.width/2-250, y: canvas.height/2-250},
tanksSize=150, laserWidth = 10;
const teslaRange = tanksSize*5.5;
const MGunRange = tanksSize*5;
const teslaLen  = canvas.width/tanksSize;
var attackRange = 600,attackRangeEneimes=450, bulletSpeed = 25, damage = 100, laserRange = 400;
const maxExplosionFrames = 8, explosionSpeed = 4, maxFlash=3, aviableTanks = ['08', '07', '06'], avliableHullColors = ['A', 'B'],aviableFlashs = ['A', 'B'],
aviableGuns = ['01', '04'], //,'04' - firegun ,'02' - tesla, ,'06' - doublegun ,'08' -  MG '01', - Thunder , '03'- rico
aviableGunsForAllies = ['01', '06'], // 01, 06
aviableTracks = ['1', '2', '3', '4'],
aviableTireTracks = ['1, 2'];
const firegunIMG = '04',
teslaIMG = '02',
doublegunIMG = '06',
MGIMG = '08',
thunderIMG = '07',
ricoIMG = '03',
freezeIMG = '05';
var bullets = [];
const icons = new Image();
icons.src = `${srcImg}icons.png`;
const ICON_SIZE = 128;
const laser = new Image();
laser.src=`${srcImg}Effects/Laser.png`;
const laserCircle = new Image(), laserCircleSize = 80, thunderSize = 3;
laserCircle.src=`${srcImg}Effects/laserCircle.png`
const crosshair = new Image();
crosshair.src=`${srcImg}crosshair.png`;
const bombCrosshair = new Image();
bombCrosshair.src = `${srcImg}bombCrosshair.png`;
const plane = new Image();
plane.src = `${srcImg}Planes/US_b17.png`;
const ricoBullet = new Image(), ricoBulletSize = 20, freezeBullet = new Image();
ricoBullet.src = `${srcImg}ricoBullet.png`;
freezeBullet.src = `${srcImg}freezeBullet.png`;
const ray = new Image();
ray.src = `${srcImg}Effects/ray.png`;
const health_img = new Image();
health_img.src = `${srcImg}health.png`;
const ricochetBullets = [], freezeGunBullets = [],
ricochetBulletsSpeed = 20, freezeGunBulletsSpeed = 7;
const raySize = 20, rayRange = 400;
const rayExps = [], rayExpSize = 100;
for(let i = 1; i <= 8; ++i){
    let g = new Image();
    g.src=`${srcImg}Effects/rayExp${i}.png`;
    rayExps.push(g);
}

var COLLECT_RANGE = 100;

const playerStatesList = [
    {
        name: 'speed',
        cur: 0, max: 8,
        img: '#fcea47',
        icon: {x: 1, y: 1},
        active: true
    },
    {
        name: 'health',
        cur: 0, max: 10,
        img: '#fa166a',
        icon: {x: 1, y: 0},
        active: true
    },{
        name: 'countShots',
        cur: 0, max: 2,
        img: '#858585',
        icon: {x: 0, y: 1},
        active: false
    },{
        name: 'damage',
        cur: 0, max: 10,
        img: '#ff5900',
        icon: {x: 0, y: 0},
        active: false
    },
    {
        name: 'laser',
        cur: 0, max: 6,
        img: '#7097BA',
        icon: {x: 2, y: 1},
        active: false
    },
    {
        name: 'airSupport',
        cur: 0,
        max: 3,
        img: '#03fca9',
        icon: {x: 2, y: 0},
        active: false
    },
    {
        name: 'ray',
        cur: 0,
        max: 4,
        img: '#000',
        icon: {x: 3, y: 0},
        active: false
    },
    {
        name: 'collect_range',
        cur: 0,
        max: 3,
        img: 'blue',
        icon: {x: 0, y :2},
        active: false
    }
],
playerStates = {
    speed: 0,
    health: 1,
    countShots: 2,
    damage: 3,
    laser: 4,
    airSupport: 5,
    ray: 6,
    collect_range: 7
}
const tanksParams={ 
    '01':{
        hull: {center:{x:128, y:174},
    track:{x: 39, w: 43, h: 256, y: 6},
    border: {x: 39, y:6, dy: -6},
    fire: 245
}, gun: {center:{x: 128, y: 160},border:{
        y: 0
}}
    },
    '03':{
        hull: {center:{x:128, y:157},
    track:{x: 51, w: 41, h: 246, y: 5},
    border: {x: 51, y:5, dy: 4},
    fire: 241
}, gun: {center:{x: 128, y: 153},border:{
        y: 21
}}
    },
    '04':{
        hull: {center:{x:128, y:174},
    track:{x: 67, w: 34, h: 210, y: 37},
    border: {x: 67, y:37, dy: 9},
    fire: 239
}, gun: {center:{x: 128, y: 163},border:{
    y: 16
}} //y:10
    },
    '06':{
        hull: {center:{x:128, y:148},
    track:{x: 45, w: 49, h: 257, y: 0},
    border: {x: 45, y:0, dy: -1},
    fire: 241
}, gun: {center:{x: 128, y: 144},border:{
    y: 29
}}
    },
    '05':{
        hull: {center:{x:128, y:153},
        track:{x: 45, w: 43, h: 252, y: 2},
        border: {x: 45, y: 2, dy: 2},
        fire: 244
    }, gun: {center:{x: 128, y: 157},border:{
        y: 0
}}
    },
    '02':{
        hull: {center:{x:128, y:150},
        track:{x: 39, w: 43, h: 256, y: 6},
        border: {x: 39, y:6, dy: -6},
        fire: 229
    }, gun: {center:{x: 128, y: 148},border:{
        y: 0
}}
    },
    '08':{
        hull: {center:{x:128, y:150},
        track:{x: 63, w: 40, h: 221, y: 22},
        border: {x: 63, y:22, dy:13},
        fire: 238
    }, gun: {center:{x: 128, y: 140},border:{
        y: 17
}}
    },
    '07':{
        hull: {center:{x:128, y:152},
    track:{x: 51, w: 41, h: 246, y: 9},
    border: {x: 53, y:9, dy: 0},
    fire: 251
}, gun: {center:{x: 128, y: 159},border:{
        y: 0
}}
    },
}

const teams = {
    allies: 'allies',
    enemies: 'enemies'
}
const planeSize = canvas.width*0.4;
class Tank{
    constructor(pos, nameImg, speed, flashName='A',hullColor='A',team=teams.enemies, countShots=1, trackName='1', maxHealth=100, drawnSize=tanksSize, damageT=damage){
        this.fire = [];
        for(let i = 3; i <= 7; ++i){
            let nimg = new  Image();
            nimg.src=`${srcImg}Effects/Sprite_Effects_Exhaust_01_00${i}.png`;
            this.fire.push(nimg);
        }; //9
        this.laserImgCount = {v: 0, max: 12, freq: 1, fv: 0};
        this.lasers = [];
        for(let i = 0; i <= this.laserImgCount.max; ++i){
            let img = new Image();
            img.src = `${srcImg}Effects/Laser${i}.png`;
            this.lasers.push(img);
        }
        this.tireTrackName = '1';
        this.isRay = false;
        this.fireGunSize;
        this.rayAngle = 0;
        this.rayDamage = 30;
        this.flyDamage = 50;
        this.rayAnim = {
            cur: 0, max: 7, timer: {
                v: 0, fr: 5
            }
        }
        this.tireTrack = new Image();
        this.tireTrack.src = `${srcImg}Tracks/Tire_Track_0${this.tireTrackName}.png`
        this.laserSpeedFactor = 0.9;
        this.fireSize = drawnSize*0.1;
        this.laserWidth = laserWidth;
        this.isLaserActive = false;
        this.mTimeRBullets = mTimeRBullets;
        this.mTimeFBullets = mTimeFBullets;
        this.countLasers = 3;
        this.speedFactor = 1;
        this.rayCd = {cur: 0, max: 720};
        this.rayCount = 1;
        this.damageT = damage;
        this.fires={state: Math.floor(Math.random()*this.fire.length), freq: 6, timer: 0};
        this.countShots = countShots;
        this.hullColor = hullColor;
        this.exp = 0;
        this.trackName = trackName;
        this.lengthLaser = 0;
        this.level={cur: 0, need: 1};
        this.team = team;
        this.goBack = {active: false, time: 0, mTime: 100};
        this.rotateOnPlace = {active: false, time: 0, mTime: 90, state: 1};
        this.goStraight = {active: false, time: 0, mTime: 60, cooldown: 0};
        this.deathTime = {active: false, time: 0, mTime: 30};
        this.deathTime.time=this.deathTime.mTime;
        this.explosionTime = {active: false, time: 0, mTime: 30};
        this.explosionTime.time=this.explosionTime.mTime;
        this.isMove = false;
        this.pos=pos;
        this.laserDamage = 0.1;
        this.nameImg=nameImg;
        this.realSize = {hull: tanksParams[this.nameImg.hull].hull, gun: tanksParams[this.nameImg.gun].gun};
        this.angle={hull: 0, gun: 0};
        this.speed=speed;
        this.health={cur: maxHealth, max: maxHealth};
        this.hull = new Image();
        this.hull.src=`${srcImg}Color_${hullColor}/Hull_${nameImg.hull}.png`;
        this.gun = new Image();
        this.gun.src=`${srcImg}Color_${hullColor}/Gun_${nameImg.gun}.png`;
        this.freezeGun = new Image();
        this.freezeGun.src=`${srcImg}Effects/Gun_${nameImg.gun}Freeze.png`;
        this.freezeHull = new Image();
        this.freezeHull.src=`${srcImg}Effects/Hull_${nameImg.hull}Freeze.png`;
        this.heatGun = new Image();
        this.heatGun.src=`${srcImg}Effects/Gun_${nameImg.gun}Fire.png`;
        this.heatHull = new Image();
        this.heatHull.src=`${srcImg}Effects/Hull_${nameImg.hull}Fire.png`;
        this.drawnSize = drawnSize; 
        this.radius = Math.sqrt(Math.pow(this.realSize.hull.center.x*this.drawnSize/this.hull.width, 2)+Math.pow(this.realSize.hull.center.y*this.drawnSize/this.hull.width, 2));
        this.track = [new Image(), new Image()];
        this.track[0].src=`${srcImg}Tracks/Track_${this.trackName}_A.png`;
        this.track[1].src=`${srcImg}Tracks/Track_${this.trackName}_B.png`;
        this.freezeTrack = new Image();
        this.freezeTrack.src = `${srcImg}Effects/Track_${this.trackName}Freeze.png`;
        this.heatTrack = new Image();
        this.heatTrack.src = `${srcImg}Effects/Track_${this.trackName}Fire.png`;
        this.tracks={state: 0, freq: 4, timer: 0};
        this.border = tanksParams[this.nameImg.hull].hull.border;
        this.shiftGun={backM: 10, back: 10, straight: 10, state: false};
        // this.explosion = new Image();
        // this.explosion.src =`${srcImg}Effects/Explosion_1.png`;
        this.explosion = [];
        for(let i = 1; i <= maxExplosionFrames; ++i){
            let im = new Image();
            im.src=`${srcImg}Effects/Explosion_${i}.png`;
            this.explosion.push(im);
        }
        this.flash = [];
        for(let i = 1; i <= maxFlash; ++i){
            let im = new Image();
            im.src=`${srcImg}Effects/Flash_${flashName}_0${i}.png`;
            this.flash.push(im);
        }
        this.isFlash =  {state: false, frame: 0, mTime: 12, time: 12};
        // this.bullet = new Image();
        // this.bullet.src =`${srcImg}Effects/Medium_Shell.png`;
        this.bulletParams = {size: this.drawnSize/2, mTime: 60};
        this.reload = {t: Math.floor(Math.random()*50), mTime: 100}
        this.laserRange = laserRange;
        this.bombardment = {
            isActive: false,
            time:{
                cur: 0,
                fq: 1,
            },
            action: {
                isActive: false,
                time: 0,
                mTime: 60
            },
            pos: {x: 0, y: 0},
            enemy: undefined,
            bombed: false,
            cd:{
                cur: 0,
                max: 500,
            },
            crosshair: {cur: 0, max: 100}
        }
        this.isFiregun = false;
        this.firesImg = [];
        for(let i = 1; i <= 8; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Effects/Flame_${i}.png`;
            this.firesImg.push(nf);
        }
        this.attackRange = 1;
        this.fireParams = {timer: 0, fr: 5, f: 0, mf: 7}; //, start: false
        this.firegunActive = false;
        this.firegunCD = false;
        this.firegunSpeed = 1;
        this.endFG = {start: 4, end: 0, isActive: false, f: 0};
        this.rotateGunSpeed = rotateGunSpeed;
        this.isTesla = false;
        this.teslaActive = false;
        this.teslaParams = {timer: 0, fr: 5, f: 0, mf: 7};
        this.teslaImg = [];
        for(let i = 1; i <= 8; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Effects/LaserT${i}.png`;
            this.teslaImg.push(nf);
        }
        this.teslaStartImg = [];
        for(let i = 1; i <= 6; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Effects/LTS${i}.png`;
            this.teslaStartImg.push(nf);
        }
        this.teslaSize = 5;
        this.teslaReload = false;
        this.isMGun = false;
        this.MGImg = [];
        this.MGActive = false;
        for(let i = 1; i <= 3; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Effects/MGun.png`;
            this.MGImg.push(nf);
        }
        this.MGgI = [];
        for(let i = 1; i <= 2; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Color_${this.hullColor}/MG${i}.png`;
            this.MGgI.push(nf);
        }
        this.MGiParams = {timer: 0, fr: 3, f: 0, mf: 1};
        this.MGParams = {timer: 0, fr: 5, f: 0, mf: 2};
        this.MGBParams = {timer: 0, fr: 1, f: 0, mf: 2};
        this.MGSize = MGunRange;
        this.SMGParams = {t: 0, mTime: 150, dir: 1};
        this.endMG = false;
        this.isThunder = false;
        this.isRicochet = false;
        this.rickCD = {t:0,  mTime: 30};
        this.rickoShot = true;
        this.frCD = {t:0,  mTime: 15};
        this.frShot = true;
        this.isFreezegun = false;
        this.temp = 0;
        this.attackedBF = false;
        this.MGtime = 0;
        this.overheat = 0;
        //{hull: {w: drawnSize,h:drawnSize}, gun:{w:drawnSize, h:drawnSize}};
        // this.drawnSize.hull.h=this.drawnSize.hull.w; //this.hull.height*this.drawnSize.hull.w/this.hull.width
        // this.drawnSize.gun.w=this.drawnSize.hull.w;
        // this.drawnSize.gun.h=this.drawnSize.hull.h;
    }
    drawExplosion(){
            if(this.explosionTime.time > 0) {c.drawImage(p.explosion[Math.floor(((this.explosionTime.mTime-this.explosionTime.time)/this.explosionTime.mTime)*maxExplosionFrames)], 0, 0, this.explosion[0].width, this.explosion[0].height, -this.bulletParams.size*1.5, -this.bulletParams.size*1.5, this.bulletParams.size*3, this.bulletParams.size*3);
            this.explosionTime.time--;}
            else {this.explosionTime.active=false;}
    }
    setHull(newHull){
        this.nameImg.hull=newHull;
        this.hull.src=`${srcImg}Color_${this.hullColor}/Hull_${newHull}.png`;
        this.border = tanksParams[this.nameImg.hull].hull.border;
        this.realSize.hull = tanksParams[this.nameImg.hull].hull;
        this.freezeHull.src=`${srcImg}Effects/Hull_${this.nameImg.hull}Freeze.png`;
        this.heatHull.src=`${srcImg}Effects/Hull_${this.nameImg.hull}Fire.png`;
    }
    setGun(newGun){
        this.nameImg.gun=newGun;
        this.gun.src=`${srcImg}Color_${this.hullColor}/Gun_${newGun}.png`;
        this.realSize.gun = tanksParams[this.nameImg.gun].gun;
        this.freezeGun.src=`${srcImg}Effects/Gun_${this.nameImg.gun}Freeze.png`;
        this.heatGun.src=`${srcImg}Effects/Gun_${this.nameImg.gun}Fire.png`;
        this.MGgI = [];
        for(let i = 1; i <= 2; ++i){
            let nf = new Image();
            nf.src=`${srcImg}Color_${this.hullColor}/MG${i}.png`;
            this.MGgI.push(nf);
        }
    }
    justDraw(p=undefined){
        if(p)
        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0
        else{
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
        }
        c.rotate(this.angle.hull*Math.PI/180);
        
        c.drawImage(this.track[this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
            this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
            -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
             tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
             tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
             c.drawImage(this.track[1-this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
                this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
                this.tracks.timer++;
                
                // c.fillRect(-this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                c.drawImage(this.hull, 0, 0, this.hull.width, this.hull.height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                if(this.isMove)
                {   

                    c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*0.85, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*1.15, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);}
                c.rotate(this.angle.gun*Math.PI/180);
                c.drawImage(this.gun, 0, 0, this.gun.width, this.gun.height, -this.realSize.gun.center.x*this.drawnSize/this.gun.width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
                
                
                if(this.isFlash.state)    {
                    this.isFlash.frame=Math.floor(((this.isFlash.mTime-this.isFlash.time)/this.isFlash.mTime)*maxFlash);
                    c.drawImage(this.flash[this.isFlash.frame], 0, 0, this.flash[0].width, this.flash[0].height, -this.realSize.gun.center.x/2*this.drawnSize/this.gun.width, -(this.gun.height-tanksParams[this.nameImg.gun].gun.border.y)*this.drawnSize/this.gun.height, this.drawnSize/2, this.drawnSize/2);
            this.isFlash.time--;
            if(this.isFlash.time <= 0) {
                this.isFlash.state = false;
                this.isFlash.time=this.isFlash.mTime;
            }
        }
        if(this.deathTime.active){
            
            if(this.deathTime.time > 0) {c.drawImage(p.explosion[Math.floor(((this.deathTime.mTime-this.deathTime.time)/this.deathTime.mTime)*maxExplosionFrames)], 0, 0, this.explosion[0].width, this.explosion[0].height, -this.bulletParams.size*1.5, -this.bulletParams.size*1.5, this.bulletParams.size*3, this.bulletParams.size*3);
           }
        }
        if(this.team == teams.allies){
            c.fillStyle='DarkBlue';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
                c.fillStyle='rgb(0,0,255)';
                c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
            if(p==undefined){
            c.fillStyle='green';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3, this.drawnSize/20);
            c.fillStyle='rgb(0,255,0)';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3*(this.reload.mTime-this.reload.t)/this.reload.mTime, this.drawnSize/20);
            this.updateReload();
            }
        }
        else{ //отрисовка хп у противников
            c.fillStyle='DarkRed ';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
            c.fillStyle='Red';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
        }
        c.setTransform(1,0,0,1,0,0);
    }

    drawHull(p=undefined){
        if(this.bombardment.cd.cur > 0){
            this.bombardment.cd.cur--;
        }
        if(this.goBack.time > 0 && this.goBack.active) this.goBack.time--;
        else if(this.goBack.active){this.goBack.active=false;
            this.rotateOnPlace.active=true;
            this.rotateOnPlace.time=this.rotateOnPlace.mTime;
            this.rotateOnPlace.state = (Math.random()> 0.5)?1:-1;}
        if(this.rotateOnPlace.active){
            if(this.rotateOnPlace.time > 0) this.rotateOnPlace.time--;
            else{
                this.rotateOnPlace.active=false;
            }
        }
        if(p)
        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0

        else{
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
        }
        c.rotate(this.angle.hull*Math.PI/180);
        if(this.isLaserActive)
        for(let i = 0; i < this.countLasers; ++i){ 
            // c.drawImage(laser, 0, 0, laser.width, laser.height, -laserWidth*this.countLasers/4 + laserWidth*i/2, 0, laserWidth, -this.lengthLaser);
        }
        c.drawImage(this.track[this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
            this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
            -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
             tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
             tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
        c.drawImage(this.track[1-this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
                this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
                this.tracks.timer++;
                if(this.tracks.timer%this.tracks.freq==0 && this.isMove){
                    this.tracks.state++;
                    this.tracks.state%=2;
                }

        
        if(this.temp < 0)
        {
            c.filter=`opacity(${this.temp/(-800)*100*0.8}%)`;
            c.drawImage(this.freezeTrack, 0, 0,this.track[0].width, this.track[0].height,
                this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                    tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                    tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
            c.drawImage(this.freezeTrack, 0, 0,this.track[0].width, this.track[0].height,
                    this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                    -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                    tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                    tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
                    this.tracks.timer++;
                    if(this.tracks.timer%this.tracks.freq==0 && this.isMove){
                        this.tracks.state++;
                        this.tracks.state%=2;
                    }
            c.filter='none';
        }
        if(this.temp > 0)
        {
            c.filter=`opacity(${(this.temp)/(800)*100*0.8}%)`;
            c.drawImage(this.heatTrack, 0, 0,this.track[0].width, this.track[0].height,
                this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                    tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                    tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
            c.drawImage(this.heatTrack, 0, 0,this.track[0].width, this.track[0].height,
                    this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                    -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                    tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                    tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
                    this.tracks.timer++;
                    if(this.tracks.timer%this.tracks.freq==0 && this.isMove){
                        this.tracks.state++;
                        this.tracks.state%=2;
                    }
            c.filter='none';
        }
        // c.fillRect(-this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
        c.drawImage(this.hull, 0, 0, this.hull.width, this.hull.height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
        
        if(this.temp < 0)
        {
            c.filter=`opacity(${this.temp/(-1000)*100}%)`;
            c.drawImage(this.freezeHull, 0, 0, this.hull.width, this.hull.height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
            c.filter='none';
        }
        if(this.temp > 0)
        {
            c.filter=`opacity(${this.temp/(1000)*100}%)`;
            c.drawImage(this.heatHull, 0, 0, this.hull.width, this.hull.height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
            c.filter='none';
        }
        if(this.isMove)
        {   this.fires.timer++;
            if(this.fires.timer%this.fires.freq == 0){
            this.fires.timer = 0;
            this.fires.state++;
        }
        if(this.fires.state >= this.fire.length){
            this.fires.state = 0;}
        c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*0.85, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
        c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*1.15, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);}
        // if(this.isMove || 1){ //следы от гусениц
        //     c.drawImage(this.tireTrack, 0, 0,this.tireTrack.width, this.tireTrack.height,
        //         this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
        //         (this.hull.height-this.realSize.hull.center.y)*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
        //          tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
        //          tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height*this.tireTrack.height/this.track[0].height);
        //     c.drawImage(this.tireTrack, 0, 0,this.tireTrack.width, this.tireTrack.height,
        //         this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
        //         (this.hull.height-this.realSize.hull.center.y)*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width,
        //         tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
        //         tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height*this.tireTrack.height/this.track[0].height);
        //     c.fillStyle='red';
        //     // c.fillRect(this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
        //     // (this.hull.height-this.realSize.hull.center.y)*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 30, 30)
        // }
        // c.rotate((this.angle.gun)*Math.PI/180);
        if(this.teslaActive)
        {
            // c.drawImage(this.teslaImg[this.teslaParams.f], 0, 0, this.teslaImg[this.teslaParams.f].width, this.teslaImg[this.teslaParams.f].height,  -tanksSize*0.25, -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height - (this.teslaSize-1)*this.drawnSize, this.drawnSize/2, this.teslaSize*this.drawnSize);
            this.teslaParams.timer++;
            if(this.teslaParams.timer % this.teslaParams.fr == 0){
                this.teslaParams.timer = 0;
                this.teslaParams.f++;
                if(this.teslaParams.f > this.teslaParams.mf) {
                    // if(this.teslaParams.start == false){
                    //     this.teslaParams.start = true;
                    //     this.teslaParams.f = 6;
                    // }
                    // else
                    // {this.teslaParams.f = 1}
                    this.teslaParams.f = 0;
                    this.teslaActive = false;
                };
            }
        }
        c.setTransform(1,0,0,1,0,0);
        this.speedFactor = 1;
    }
    drawGun(p=undefined){
        if(p)
        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0

        else{
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
        }
        
        c.rotate((this.angle.gun+this.angle.hull)*Math.PI/180);
        if(this.MGActive)
            c.drawImage(this.MGgI[this.MGiParams.f], 0, 0, this.MGgI[this.MGiParams.f].width, this.MGgI[this.MGiParams.f].height, -this.realSize.gun.center.x*this.drawnSize/this.MGgI[this.MGiParams.f].width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.MGgI[this.MGParams.f%2].height, this.drawnSize, this.drawnSize);
        else
            c.drawImage(this.gun, 0, 0, this.gun.width, this.gun.height, -this.realSize.gun.center.x*this.drawnSize/this.gun.width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
        
        if(this.temp < 0)
        {
            c.filter=`opacity(${this.temp/(-1000)*100}%)`;
            c.drawImage(this.freezeGun, 0, 0, this.gun.width, this.gun.height, -this.realSize.gun.center.x*this.drawnSize/this.gun.width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
            c.filter='none';
        }
        if(this.temp > 0)
        {
            c.filter=`opacity(${this.temp/(1000)*100}%)`;
            c.drawImage(this.heatGun, 0, 0, this.gun.width, this.gun.height, -this.realSize.gun.center.x*this.drawnSize/this.gun.width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
            c.filter='none';
        }
        if(this.isFlash.state)    {
                    this.isFlash.frame=Math.floor(((this.isFlash.mTime-this.isFlash.time)/this.isFlash.mTime)*maxFlash);
                    c.drawImage(this.flash[this.isFlash.frame], 0, 0, this.flash[0].width, this.flash[0].height, -this.realSize.gun.center.x/2*this.drawnSize/this.gun.width, -(this.gun.height-tanksParams[this.nameImg.gun].gun.border.y)*this.drawnSize/this.gun.height, this.drawnSize/2, this.drawnSize/2);
            this.isFlash.time--;
            if(this.isFlash.time <= 0) {
                this.isFlash.state = false;
                this.isFlash.time=this.isFlash.mTime;
            }
        }
        
        if(this.shiftGun.state){
            if(this.shiftGun.back>0){
                this.shiftGun.back-=2;
            }
            else if(this.shiftGun.straight > 0){
                this.shiftGun.straight-=1;
            }
            else{
                this.shiftGun.state=false;
                this.shiftGun.straight=this.shiftGun.backM;
                this.shiftGun.back=this.shiftGun.backM;

            }
        }
        if(this.deathTime.active){
            
            if(this.deathTime.time > 0) {c.drawImage(this.explosion[Math.floor(((this.deathTime.mTime-this.deathTime.time)/this.deathTime.mTime)*maxExplosionFrames)], 0, 0, this.explosion[0].width, this.explosion[0].height, -this.bulletParams.size*1.5, -this.bulletParams.size*1.5, this.bulletParams.size*3, this.bulletParams.size*3);
            this.deathTime.time--;}
            else {this.deathTime.active=false;}
        }
        else 
        if(this.explosionTime.active) this.drawExplosion();
        
        if(this.MGActive)
        {
            if(this.SMGParams.t == this.SMGParams.mTime)
            {c.fillStyle='#FCA601';
            c.fillRect(this.drawnSize*0.03*(this.MGParams.f-1), -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height - this.MGSize + this.drawnSize, tanksSize*0.01, this.MGSize);
            c.fillStyle='#F9C710';
            c.fillRect(-this.drawnSize*0.03+this.drawnSize*0.03*((this.MGBParams.f+1)%(this.MGBParams.mf+1)), -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height - this.MGSize + this.drawnSize, tanksSize*0.01, this.MGSize);
            c.drawImage(this.MGImg[this.MGParams.f], 0, 0, this.MGImg[this.MGParams.f].width, this.MGImg[this.MGParams.f].height,  -tanksSize*0.5, -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
            this.MGParams.timer++;
            this.MGBParams.timer++;
            
            if(this.MGParams.timer % this.MGParams.fr == 0){
                this.MGParams.timer = 0;
                this.MGParams.f++;
                if(this.MGParams.f > this.MGParams.mf) {
                    // if(this.MGParams.start == false){
                    //     this.MGParams.start = true;
                    //     this.MGParams.f = 6;
                    // }
                    // else
                    // {this.MGParams.f = 1}
                    this.MGParams.f = 0;
                };
            }
            if(this.MGBParams.timer % this.MGBParams.fr == 0){
                this.MGBParams.timer = 0;
                this.MGBParams.f++;
                if(this.MGBParams.f > this.MGBParams.mf) {
                    // if(this.MGBParams.start == false){
                    //     this.MGBParams.start = true;
                    //     this.MGBParams.f = 6;
                    // }
                    // else
                    // {this.MGBParams.f = 1}
                    this.MGBParams.f = 0;
                };
            }}
            this.MGiParams.timer++;
            if(this.MGiParams.timer % (Math.floor((this.SMGParams.mTime - this.SMGParams.t)/this.SMGParams.mTime*this.MGiParams.fr*3) + this.MGiParams.fr) == 0){
                this.MGiParams.timer = 0;
                this.MGiParams.f++;
                if(this.MGiParams.f > this.MGiParams.mf) {
                    // if(this.MGiParams.start == false){
                    //     this.MGiParams.start = true;
                    //     this.MGiParams.f = 6;
                    // }
                    // else
                    // {this.MGiParams.f = 1}
                    this.MGiParams.f = 0;
                };
            }
            if(this.endMG){
                this.MGtime = 0;
                this.overheat = 0;
                this.SMGParams.t--;
                if(this.SMGParams.t == 0)
                {
                    this.MGActive=false;
                    this.endMG=false;
                }
            }
            
        }
        if(this.team == teams.allies){
            c.fillStyle='DarkBlue';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
                c.fillStyle='rgb(0,0,255)';
                c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
            if(p==undefined){
            c.fillStyle='green';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3, this.drawnSize/20);
            c.fillStyle='rgb(0,255,0)';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3*(this.reload.mTime-this.reload.t)/this.reload.mTime, this.drawnSize/20);
            this.updateReload();
            }
        }
        else{ //отрисовка хп у противников
            c.fillStyle='DarkRed ';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
            c.fillStyle='Red';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
            // c.fillStyle='green';
            // c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3, this.drawnSize/20);
            // c.fillStyle='rgb(0,255,0)';
            // c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3*(this.reload.mTime-this.reload.t)/this.reload.mTime, this.drawnSize/20);
            // this.updateReload();
        }
        c.setTransform(1,0,0,1,0,0);
        this.isMove=false;
        if(this.overheat){
            this.health.cur-=0.1;
        }
        if(this.temp > 0 && !this.attackedBF && !this.overheat) {this.temp-=1; this.health.cur-=0.2; if(this.temp < 0) this.temp = 0;}
        this.attackedBF = false;
        if(this.temp < 0) this.temp+=0.5;
    }
    drawEffects(p=undefined){
        if(p)
        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0

        else{
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
        }
        
        c.rotate((this.angle.gun+this.angle.hull)*Math.PI/180);
        if(this.endFG.isActive){
            this.fireParams.timer++;
            if(this.fireParams.timer%this.fireParams.fr == 0){
                this.fireParams.timer  = 0;
                this.endFG.f--;
                if(this.endFG.f == this.endFG.end) {
                    // if(this.fireParams.start == false){
                    //     this.fireParams.start = true;
                    //     this.fireParams.f = 6;
                    // }
                    // else
                    // {this.fireParams.f = 1}
                    this.endFG.isActive = false;
                };
            }
            c.drawImage(this.firesImg[this.endFG.f], 0, this.firesImg[this.fireParams.f].height * (1-this.fireGunSize), this.firesImg[this.endFG.f].width, this.firesImg[this.endFG.f].height * this.fireGunSize, -tanksSize/2, -tanksSize * this.fireGunSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y)*this.drawnSize/this.gun.height, tanksSize, tanksSize * this.fireGunSize);
        }
        if(this.firegunActive){
            this.fireParams.timer++;
            if(this.fireParams.timer%this.fireParams.fr == 0){
                this.fireParams.timer  = 0;
                this.fireParams.f++;
                if(this.fireParams.f > this.fireParams.mf) {
                    // if(this.fireParams.start == false){
                    //     this.fireParams.start = true;
                    //     this.fireParams.f = 6;
                    // }
                    // else
                    // {this.fireParams.f = 1}
                    this.fireParams.f = 5;
                };
            }
            c.drawImage(this.firesImg[this.fireParams.f], 0,  this.firesImg[this.fireParams.f].height * (1-this.fireGunSize), this.firesImg[this.fireParams.f].width, this.firesImg[this.fireParams.f].height * this.fireGunSize, -tanksSize/2, -tanksSize * this.fireGunSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y)*this.drawnSize/this.gun.height, tanksSize, tanksSize * this.fireGunSize);
            
        }
        c.setTransform(1,0,0,1,0,0);
    }
    draw(p=undefined){
        if(this.goBack.time > 0 && this.goBack.active) this.goBack.time--;
        else if(this.goBack.active){this.goBack.active=false;
            this.rotateOnPlace.active=true;
            this.rotateOnPlace.time=this.rotateOnPlace.mTime;
            this.rotateOnPlace.state = (Math.random()> 0.5)?1:-1;}
        if(this.rotateOnPlace.active){
            if(this.rotateOnPlace.time > 0) this.rotateOnPlace.time--;
            else{
                this.rotateOnPlace.active=false;
            }
        }
        if(p)
        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0

        else{
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
        }
        c.rotate(this.angle.hull*Math.PI/180);
        if(this.isLaserActive)
        for(let i = 0; i < this.countLasers; ++i){ 
            // c.drawImage(laser, 0, 0, laser.width, laser.height, -laserWidth*this.countLasers/4 + laserWidth*i/2, 0, laserWidth, -this.lengthLaser);
        }
        c.drawImage(this.track[this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
            this.realSize.hull.center.x*this.drawnSize/this.hull.width-this.drawnSize+tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
            -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
             tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
             tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
             c.drawImage(this.track[1-this.tracks.state], 0, 0,this.track[0].width, this.track[0].height,
                this.realSize.hull.center.x*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width-tanksParams[this.nameImg.hull].hull.track.x*this.drawnSize/this.hull.width , 
                -this.realSize.hull.center.y*this.drawnSize/this.hull.height+tanksParams[this.nameImg.hull].hull.track.y*this.drawnSize/this.hull.width, 
                tanksParams[this.nameImg.hull].hull.track.w*this.drawnSize/this.hull.width,
                tanksParams[this.nameImg.hull].hull.track.h*this.drawnSize/this.hull.height);
                this.tracks.timer++;
                if(this.tracks.timer%this.tracks.freq==0 && this.isMove){
                    this.tracks.state++;
                    this.tracks.state%=2;
                }
                // c.fillRect(-this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                c.drawImage(this.hull, 0, 0, this.hull.width, this.hull.height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width, -this.realSize.hull.center.y*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                if(this.isMove)
                {   this.fires.timer++;
                    if(this.fires.timer%this.fires.freq == 0){
                    this.fires.timer = 0;
                    this.fires.state++;
                }
                if(this.fires.state >= this.fire.length){
                    this.fires.state = 0;}

                    c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*0.85, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);
                c.drawImage(this.fire[this.fires.state], 0, this.fire[0].height/2, this.fire[0].width, this.fire[0].height, -this.realSize.hull.center.x*this.drawnSize/this.hull.width*1.15, (this.realSize.hull.fire-this.realSize.hull.center.y)*this.drawnSize/this.hull.height, this.drawnSize, this.drawnSize);}
                c.rotate(this.angle.gun*Math.PI/180);
                c.drawImage(this.gun, 0, 0, this.gun.width, this.gun.height, -this.realSize.gun.center.x*this.drawnSize/this.gun.width, (-this.realSize.gun.center.y-this.shiftGun.back+this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
                
                
                if(this.isFlash.state)    {
                    this.isFlash.frame=Math.floor(((this.isFlash.mTime-this.isFlash.time)/this.isFlash.mTime)*maxFlash);
                    c.drawImage(this.flash[this.isFlash.frame], 0, 0, this.flash[0].width, this.flash[0].height, -this.realSize.gun.center.x/2*this.drawnSize/this.gun.width, -(this.gun.height-tanksParams[this.nameImg.gun].gun.border.y)*this.drawnSize/this.gun.height, this.drawnSize/2, this.drawnSize/2);
            this.isFlash.time--;
            if(this.isFlash.time <= 0) {
                this.isFlash.state = false;
                this.isFlash.time=this.isFlash.mTime;
            }
        }
        
        if(this.shiftGun.state){
            if(this.shiftGun.back>0){
                this.shiftGun.back-=2;
            }
            else if(this.shiftGun.straight > 0){
                this.shiftGun.straight-=1;
            }
            else{
                this.shiftGun.state=false;
                this.shiftGun.straight=this.shiftGun.backM;
                this.shiftGun.back=this.shiftGun.backM;

            }
        }
        if(this.deathTime.active){
            
            if(this.deathTime.time > 0) {c.drawImage(p.explosion[Math.floor(((this.deathTime.mTime-this.deathTime.time)/this.deathTime.mTime)*maxExplosionFrames)], 0, 0, this.explosion[0].width, this.explosion[0].height, -this.bulletParams.size*1.5, -this.bulletParams.size*1.5, this.bulletParams.size*3, this.bulletParams.size*3);
            this.deathTime.time--;}
            else {this.deathTime.active=false;}
        }
        if(this.team == teams.allies){
            c.fillStyle='DarkBlue';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
                c.fillStyle='rgb(0,0,255)';
                c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
            if(p==undefined){
            c.fillStyle='green';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3, this.drawnSize/20);
            c.fillStyle='rgb(0,255,0)';
            c.fillRect(-this.drawnSize/6, this.drawnSize/20, this.drawnSize/3*(this.reload.mTime-this.reload.t)/this.reload.mTime, this.drawnSize/20);
            this.updateReload();
            }
        }
        else{ //отрисовка хп у противников
            c.fillStyle='DarkRed ';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3, this.drawnSize/20);
            if(this.health.cur > 0){
            c.fillStyle='Red';
            c.fillRect(-this.drawnSize/6, -this.drawnSize/40, this.drawnSize/3*(this.health.cur/this.health.max), this.drawnSize/20);
            }
        }
        c.setTransform(1,0,0,1,0,0);
        this.isMove=false;
    }
    updateReload(p=undefined){
        if(this.teslaReload){
            this.reload.t++;
            if(p)
                c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y); //+p?(-p.pos.x+this.pos.x):0, +p?(-p.pos.y+this.pos.y):0
            else{
                c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
            }
            c.rotate((this.angle.hull+this.angle.gun)*Math.PI/180);
            if(this.reload.t == this.reload.mTime){
                if(p)
                {
                    setTimeout(()=>{teslaShotE(this);}, 1);
                }
                else
                setTimeout(()=>{teslaShot();}, 1);
                
                this.teslaReload = false;
            }
            else
            c.drawImage(this.teslaStartImg[Math.floor((this.reload.t)/this.reload.mTime*(this.teslaStartImg.length))], 0, 0, this.teslaStartImg[Math.floor(this.reload.t/this.reload.mTime)*this.teslaStartImg.length].width, this.teslaStartImg[Math.floor(this.reload.t/this.reload.mTime)*this.teslaStartImg.length].height,  -tanksSize*0.5, -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height, this.drawnSize, this.drawnSize);
        }
        if(this.reload.t > 0 && !this.firegunActive && !this.teslaReload && !this.MGActive && !this.isRicochet && !this.isFreezegun){
            this.reload.t--;
            if(this.reload.t <= 0) {this.reload.t = 0;}
            if(this.isFiregun && this.reload.t > 1){
                this.reload.t-=2;
            }
        }
        else{
            this.firegunCD=false;
        }
        if(this.isRicochet){
            if(this.reload.t > 0)
            this.reload.t-=0.6;
            if(this.reload.t <= 0) {this.reload.t = 0; this.rickoShot=true;}
        }
        if(this.isFreezegun){
            if(this.reload.t > 0)
            this.reload.t-=0.8;
            if(this.reload.t <= 0) {this.reload.t = 0; this.frShot=true;}
        }
        if(this.isRicochet && this.rickCD.t > 0)
            this.rickCD.t--;
        if(this.isFreezegun && this.frCD.t > 0)
            this.frCD.t--;
    }
    updateLaser(p=undefined){
        let ts =[], tks = [];
        if(this.team == teams.allies)
        ts = tanks.filter(t=>{return (

            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-this.pos.x-this.realSize.hull.center.x*this.drawnSize/this.hull.width, 2)
            +
            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-this.pos.y-this.realSize.hull.center.y*this.drawnSize/this.hull.width, 2) ) 
            < Math.pow(this.laserRange, 2) && t.pos.x != this.pos.x && t.pos.y != this.pos.y;});
        else 
            ts = [...allies, p].filter(t=>{return (

            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-this.pos.x-this.realSize.hull.center.x*this.drawnSize/this.hull.width, 2)
            +
            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-this.pos.y-this.realSize.hull.center.y*this.drawnSize/this.hull.width, 2) ) 
            < Math.pow(this.laserRange, 2) && t.pos.x != this.pos.x && t.pos.y != this.pos.y;});
        
        if(ts.length > 0){
            for(let i = 0; i < this.countLasers; ++i)
                {
                    if(p)
                        c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y);
                    else c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
                    if(i < ts.length)
                {
                    let alpha = Math.atan((ts[i].pos.y-this.pos.y) / (ts[i].pos.x - this.pos.x)) * 180 / Math.PI  + 90;
                    if(ts[i].pos.x < this.pos.x) alpha+=180;
                c.rotate(alpha * Math.PI / 180);
                let distToEnemy = Math.sqrt(Math.pow(this.pos.x-ts[i].pos.x, 2)+ Math.pow(this.pos.y-ts[i].pos.y, 2));
                c.drawImage(this.lasers[this.laserImgCount.v], 0, 0, laser.width, laser.height, -this.laserWidth/2, 0, this.laserWidth*(distToEnemy <= this.laserRange/2?1:((this.laserRange*1.5-distToEnemy)/this.laserRange)), -distToEnemy);
                // c.fillStyle='red';
                // c.beginPath();
                // c.moveTo(this.pos.x - (p.pos.x -canvas.width/2), this.pos.y - (p.pos.y -canvas.height/2));
                // c.lineTo(ts[i].pos.x - (p.pos.x -canvas.width/2), ts[i].pos.y - (p.pos.y -canvas.height/2));
                // c.stroke();
                if(ts[i].health.cur > 0)
                ts[i].health.cur-=this.laserDamage;
                ts[i].speedFactor = this.laserSpeedFactor;
                if(this.health.cur < this.health.max) {if(p) this.health.cur+=this.laserDamage*2; else this.health.cur+=this.laserDamage;}
                c.setTransform(1,0,0,1,0,0);
                c.drawImage(laserCircle, 0, 0, laserCircle.width,laserCircle.height, ts[i].pos.x+(canvas.width/2-(p?p.pos.x:this.pos.x))-laserCircleSize/2, ts[i].pos.y +(canvas.height/2-(p?p.pos.y:this.pos.y))-laserCircleSize/2, laserCircleSize, laserCircleSize);
            }}
        }
        c.setTransform(1,0,0,1,0,0);
        this.laserImgCount.fv++;
        if(this.laserImgCount.fv == this.laserImgCount.freq){
            this.laserImgCount.v++;
            this.laserImgCount.v%=(this.laserImgCount.max+1);
            this.laserImgCount.fv=0;
        }
    }

}

let pumping_id_ = 0; 

class Pumping{
    /**
     * 
     * @param {string} text 
     * @param {{x: number, y: number}} img 
     * @param {Function} pump 
     * @param {number} count 
     */
    constructor(text='none', img={x: 0, y: 1}, pump=()=>{}, count = 1){
        this.text = text;
        this.img = img;
        this.pump = pump;
        this.count = count;
        this.id = pumping_id_ + 1;
        pumping_id_++;
    }
}
const pumpings = [
// new Pumping('двойна пушка', '#EE77FA', ()=>{playerStatesList[playerStates.countShots].cur++; p.countShots=2; p.setGun(doublegunIMG);p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false;  p.reload.mTime = 50; p.damageT = 30; p.isRicochet = false; p.isFreezegun=false; }),
new Pumping('Поддержка с воздуха', {x: 2, y: 0}, ()=>{
    playerStatesList[playerStates.airSupport].active=true; 
    p.bombardment.isActive=true;
    pumpings.push(
        new Pumping('Увеличить урон', {x: 2, y: 0}, ()=>{
            p.flyDamage+=20;
            playerStatesList[playerStates.airSupport].cur++; 
        }, playerStatesList[playerStates.airSupport].max),
    )
}),
new Pumping('увеличение скорости', {x: 1, y : 1}, ()=>{playerStatesList[playerStates.speed].cur++; p.speed*=1.05;}, playerStatesList[playerStates.speed].max),
new Pumping('Увеличение максмального здоровья', {x: 1, y: 0}, ()=>{
    playerStatesList[playerStates.health].cur++; 
    p.health.max+=60;
    p.health.cur = p.health.max;
}, playerStatesList[playerStates.health].max-1),
// new Pumping('сменить корпус', '#4e369e', ()=>{p.setHull(pickUpRandomFromArray(aviableTanks))}),
// new Pumping('сменить пушку', '#FF00FA', ()=>{p.setGun(pickUpRandomFromArray(aviableTanks))}),
new Pumping('Увеличить урон', {x: 0, y: 0}, ()=>{
    playerStatesList[playerStates.damage].active=true;
    p.damageT*=1.2;
    pumpings.push(new Pumping('Увеличить урон', {x: 0, y: 0}, ()=>{playerStatesList[playerStates.damage].cur++; 
        p.damageT*=1.2;    
    },playerStatesList[playerStates.damage].max-1));
}),
new Pumping('Радиус сбора +20%', {x: 0, y: 2},
()=>{
    playerStatesList[playerStates.collect_range].active=true;
    playerStatesList[playerStates.collect_range].cur++;
    COLLECT_RANGE*=1.2;
    pumpings.push(
        new Pumping('Радиус сбора +30%', {x: 0, y: 2},
        ()=>{
            playerStatesList[playerStates.collect_range].cur++;
            COLLECT_RANGE*=1.3;
            pumpings.push(
                new Pumping('Радиус сбора +40%', {x: 0, y: 2},
                ()=>{
                    playerStatesList[playerStates.collect_range].cur++;
                    COLLECT_RANGE*=1.4;
                })
            )
        }),
    )
}
)
// new Pumping('ОГНЕМЁТ', '#fc6203', ()=>{p.reload.t = 0;p.isRicochet = false; p.isTesla=false; p.isFiregun=true; p.isMGun=false; p.MGActive = false; p.isThunder=false; p.setGun(firegunIMG); p.damageT=2; p.reload.mTime = 86; p.isFreezegun=false;}),
// new Pumping('РЕЛЬСА', '#00fffb', ()=>{p.reload.t = 0;p.isRicochet = false; p.isTesla=true; p.isFiregun=false; p.isMGun=false; p.MGActive = false; p.isThunder=false; p.setGun(teslaIMG); p.damageT=50; p.reload.mTime = 70; p.isFreezegun=false;}),
// new Pumping('ПУЛЕМЁТ', '#00fffb', ()=>{p.reload.t = 0;p.isRicochet = false; p.isMGun=true; p.isFiregun=false; p.isTesla=false; p.setGun(MGIMG); p.isThunder=false; p.damageT=1; p.reload.mTime = 100; p.isFreezegun=false;}),
// new Pumping('ГРОМ', '#75726b', ()=>{p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=true; p.setGun(thunderIMG); p.damageT=50; p.reload.mTime = 70;
// p.isRicochet = false; p.isFreezegun=false; p.MGActive = false;}),
// new Pumping('РИКОШЕТ', '#eb4c34', ()=>{p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false; p.setGun(ricoIMG); p.damageT=30; p.reload.mTime = 200; p.MGActive = false;
//     p.isRicochet = true; p.isFreezegun=false;}),
// new Pumping('ФРИЗ', '#FFFFFF', ()=>{p.reload.t = 0; p.isMGun=false; p.isFiregun=false; p.isTesla=false; p.isThunder=false; p.setGun(freezeIMG); p.damageT=17; p.reload.mTime = 180; p.MGActive = false;
    // p.isRicochet = false; p.isFreezegun=true;}),

];

const exp_image = new Image();

exp_image.src = `${srcImg}exp.png`;

const p = new Tank({x: 824, y: 350},{hull: ALL_HULLS[0], gun: ALL_GUNS[0]},8, 'A', avliableHullColors[0],teams.allies, 2, pickUpRandomFromArray(aviableTracks)), //pickUpRandomFromArray(aviableTanks)
secondTank = new Tank({x: canvas.width/2-250, y: canvas.height/2-250},{hull:'08', gun:'02'},5, 'A'); //,{hull: {center:{x:128, y:174}}, gun: {center:{x: 128, y: 160}}}
// p.bombardment.isActive = true;
p.reload.mTime=50;
damage=30;
p.countShots=1;
p.isLaserActive=0;
p.damageT = 30;
p.laserDamage = 0.1;
// p.reload.mTime = 180;
p.reload.t = 0;
p.attackRange = canvas.width*0.3;
// p.damageT=1;
// p.isRicochet = 1;
// p.isTesla = 1;
// p.isFiregun=true;
// p.setGun(firegunIMG);
// p.damageT = 1;
// p.isThunder = 1;
// p.setGun(ricoIMG);
// p.setGun(freezeIMG);
// p.isFreezegun = 1;
secondTank.angle.gun=90;
secondTank.angle.hull=45;
const allies = [];
const teslasLasers = [];
var tanks = []; //secondTank, new Tank({x: canvas.width/2+250, y: canvas.height/2-250},{hull:'06', gun:'06'},5, 'B')
// for(let i = 0; i < 5; ++i){
//     addTank();
// }
function addTank(team=teams.enemies){
    if(!document.hasFocus()) return;
    let tPos = {x: Math.random()*map.width, y: Math.random()*map.height};
    if(pointCollisionMap(tPos)) return
    const hull_ = pickUpRandomFromArray(aviableTanks);
    const gun_ = pickUpRandomFromArray(team === teams.allies ? aviableGunsForAllies : aviableGuns);
    const damageT_ = CHARACTERISTICS_GUNS[gun_].damage;
    const reload_time_ = CHARACTERISTICS_GUNS[gun_].reload_time;
    const speed_ = CHARACTERISTICS_HULLS[hull_].speed;
    const max_health_ = CHARACTERISTICS_HULLS[hull_].max_health;
    let tSpawn = new Tank(
        {x: tPos.x, y: tPos.y}, // pos
        {hull:hull_, gun:gun_}, // nameImg
        speed_, // speed
        'A', // flash name
        pickUpRandomFromArray(avliableHullColors), // hullColor
        team, // team
        1, // count shots
        pickUpRandomFromArray(aviableTracks), // track name
        max_health_ // health
        ); //Math.floor(Math.random()*2)+1, pickUpRandomFromArray(aviableFlashs)
    tSpawn.damageT = damageT_;
    tSpawn.reload.mTime = reload_time_;
    if(p.level.cur > 5){
        tSpawn.isLaserActive = Math.random()>0.8;
    }
    if(p.level.cur > 10){
        let level_5 = Math.floor(p.level.cur/5 + 1);
        tSpawn.health.max += 50 * level_5;
        tSpawn.health.cur = tSpawn.health.max;
        tSpawn.damageT += level_5;
    }
    if(gun_ === '05'){
        tSpawn.isFreezegun=1;
        tSpawn.setGun(freezeIMG);
        tSpawn.reload.mTime = 180;
        tSpawn.damageT = 17;
    }
    else
    if(gun_ === '03'){
        tSpawn.isRicochet = 1;
        tSpawn.setGun(ricoIMG);
        tSpawn.countShots = 1;
        tSpawn.reload.mTime=200;
    }
    else
    if(gun_ === '07' ){
        tSpawn.isThunder=1;
        tSpawn.damageT = 40;
        tSpawn.setGun(thunderIMG);
        tSpawn.countShots=1;
    }
    else
    if(gun_ === '02'){
        
    tSpawn.isTesla = 1;
    tSpawn.setGun(teslaIMG);
    tSpawn.reload.mTime = 100;
    tSpawn.damageT = 50;
    }
    else
    if(gun_ === '06'){
        tSpawn.countShots=2;
        tSpawn.setGun(doublegunIMG);
    }
    else if(gun_ === '04')
    {tSpawn.isFiregun = true;
    tSpawn.rotateGunSpeed = 2;
    tSpawn.damageT = 1;
    tSpawn.speed+=2;
    tSpawn.setGun(firegunIMG);
    tSpawn.countShots = 1;
    }
    else if(gun_ === '08')
    {tSpawn.isMGun = true;
    tSpawn.damageT = 1;
    tSpawn.speed-=2;
    tSpawn.setGun(MGIMG);
    tSpawn.countShots = 1;
    }
    let is_collided = collisionMap(tSpawn);
    setTimeout(()=>{
        is_collided = collisionMap(tSpawn);
    // console.log(collisionMap(tSpawn))
    let tks = [p];
    tanks.filter(t=>{return (

        Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tSpawn.pos.x-tSpawn.realSize.hull.center.x*tSpawn.drawnSize/tSpawn.hull.width, 2)
        +
        Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tSpawn.pos.y-tSpawn.realSize.hull.center.y*tSpawn.drawnSize/tSpawn.hull.width, 2) ) 
        < Math.pow(t.drawnSize*3, 2)}).forEach(f=>{tks.push(f);});
    
    allies.filter(t=>{return (

        Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tSpawn.pos.x-tSpawn.realSize.hull.center.x*tSpawn.drawnSize/tSpawn.hull.width, 2)
        +
        Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tSpawn.pos.y-tSpawn.realSize.hull.center.y*tSpawn.drawnSize/tSpawn.hull.width, 2) ) 
        < Math.pow(t.drawnSize*3, 2)}).forEach(f=>{tks.push(f);});
    // console.log(tks)
    tks.forEach(t=>{
        if(checkCollision(tSpawn, t) || checkCollision(t, tSpawn)){
            // console.log(1);
        is_collided = true;
    }
    })
    if(!is_collided){
        if(tSpawn.team==teams.enemies)
            tanks.push(tSpawn)
        else allies.push(tSpawn)
    }
}, 400)
    // tPos = {x: Math.random()*(endMap.x-beginMap.x)+beginMap.x, y: Math.random()*(endMap.y-beginMap.y)+beginMap.y};
    // tank = new Tank({x: tPos.x, y: tPos.y},{hull:pickUpRandomFromArray(aviableTanks), gun:pickUpRandomFromArray(aviableTanks)},Math.random()*3+3, pickUpRandomFromArray(aviableFlashs), pickUpRandomFromArray(avliableHullColors), teams.allies);
    // res = collisionMap(tank);
    // ts =[getBorders2(p)], tks = [p];
    // tanks.filter(t=>{return (

    //     Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
    //     +
    //     Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
    //     < Math.pow(t.drawImage*distStop, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
    
    // allies.filter(t=>{return (

    //     Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
    //     +
    //     Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
    //     < Math.pow(t.drawImage*distStop, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
    // tks.filter(t=>{return ((
    //     Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
    //     +
    //     Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
    //     < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
    //     if(checkCollision(tank, t) || checkCollision(t, tank)){
    //     res = true;
    // }})
    // if(!res)
    // allies.push(tank)
}
addTank();
setInterval(()=>{

    if(gameState !== gameStates.active){
        return
    }

    if(allies.length >= tanks.length){
        addTank();
        return
    }

    if(allies.length < 5){
        addTank(teams.allies)
        return
    }

    if(tanks.length < 10){
        addTank();
    }
}, 
3000);

let gainButtonColors = {
    bg: '#606060',
    text: '#F2F2F2',
    bottom: '#424242',
    hover: '#484848',
    img: '#ABDFCE'
}

let gainsButtons = [
    new Btn(
        {x:canvas.width*0.31,y:canvas.height*0.35},
        {width: canvas.width*0.38,height:canvas.height*0.13},
        'первое',
        structuredClone(gainButtonColors),
        {name: 'serif', size: canvas.height*0.05},
        ()=>{
            if(playerStatesList[playerStates.health].cur < playerStatesList[playerStates.health].max){
                playerStatesList[playerStates.health].cur++;
            }
            gameState=gameStates.active;
        }
    ),
    new Btn(
        {x:canvas.width*0.31,y:canvas.height*0.5},
        {width: canvas.width*0.38,height:canvas.height*0.13},
        'ВТОРОЕ',
        structuredClone(gainButtonColors),
        {name: 'serif', size: canvas.height*0.05},
        ()=>{
            gameState=gameStates.active;
        }   
    ),
    new Btn(
        {x:canvas.width*0.31,y:canvas.height*0.65},
        {width: canvas.width*0.38,height:canvas.height*0.13},
        '3',
        structuredClone(gainButtonColors),
        {name: 'serif', size: canvas.height*0.05},
        ()=>{
            gameState=gameStates.active;
        }
    )
] 
animate();

var is_start_menu_loaded = false;

function start_menu_loaded(){
    is_start_menu_loaded = true;
}

function animate(){
    // requestAnimationFrame(animate);
    setTimeout(animate, 1000/60);
    if(gameState == gameStates.active && document.hasFocus()){
        renderGame();
    }
    if(gameState == gameStates.chooseGain){
        c.fillStyle='white';
        c.setTransform(1,0,0,1,0,0);
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.drawImage(map, p.pos.x - canvas.width/2, p.pos.y - canvas.height/2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        tanks.forEach(t=>{t.justDraw(p)});
        allies.forEach(t=>t.justDraw(p));
        p.justDraw();
        let j = 0;
        playerStatesList.forEach((st, i)=>{
            if(st.active){
            c.fillStyle='gray'; //st.img
            c.fillRect(canvas.width*0.03+canvas.width*0.1*(j%3), canvas.height*0.05+canvas.width*0.1*(Math.floor(j/3)), canvas.width*0.05, canvas.width*0.05);
            c.drawImage(icons, st.icon.x*(ICON_SIZE+2), st.icon.y*(ICON_SIZE+2), ICON_SIZE, ICON_SIZE,
                 canvas.width*0.03+canvas.width*0.1*(j%3), canvas.height*0.05+canvas.width*0.1*(Math.floor(j/3)), canvas.width*0.05, canvas.width*0.05);
            // console.log(st.name, st.icon.x*(ICON_SIZE+2), st.icon.y*(ICON_SIZE+2), ICON_SIZE, ICON_SIZE);
            for(let ind = 0; ind < st.max; ind++){
                if(ind < st.cur) c.fillStyle='orange';
                else c.fillStyle='#403f3f';
                c.fillRect(canvas.width*0.03+canvas.width*0.1*(j%3)+canvas.width*0.02*(ind%3), canvas.height*0.05+canvas.width*0.055+canvas.width*0.1*(Math.floor(j/3))+canvas.width*0.015*(Math.floor(ind/3)), canvas.width*0.01, canvas.width*0.01);
            }
            j++;
        }
        })
        // c.fillStyle='#EED4B4';
        c.fillStyle = '#0C220D'
        c.fillRect(canvas.width*0.3, canvas.height*0.2, canvas.width*0.4, canvas.height*0.73)
        gainsButtons.forEach((b, i)=>{
            if(i < pumpings.length)
            b.draw(b.color.img);
        });
    }
    if(gameState === gameStates.start_menu){
        if(is_start_menu_loaded)
            renderStartMenu();
    }
    mouse.click=false;
}

function setGainState(){
    p.health.cur = p.health.max;
    gameState=gameStates.chooseGain;
    const randomGains = getRandomElements(pumpings, 3);
    for(let i = 0; i < 3; i++){
        gainsButtons[i].text = randomGains[i].text;
        gainsButtons[i].color.img = randomGains[i].img;

        gainsButtons[i].onclick = ()=>{
            randomGains[i].pump();
            gameState=gameStates.active;
            randomGains[i].count--;
            if(randomGains[i].count == 0){
                let erasing_index = pumpings.findIndex(p => p.id === randomGains[i].id);
                pumpings.splice(erasing_index, 1);
            }
            gainsButtons[i].state = 0;
        }
    }
    // gainsButtons.forEach(b=>{
    //     let index = Math.floor(Math.random()*pumpings.length);
    //     b.text = pumpings[index].text;
    //     b.color.img = pumpings[index].img;
    //     b.onclick = ()=>{
    //         pumpings[index].pump();
    //         gameState=gameStates.active;
    //         pumpings[index].count--;
    //         if(pumpings[index].count == 0)
    //             pumpings.splice(index, 1);
    //         b.state = 0;
    //     }
    // });
}

function renderGame(){
        c.fillStyle='white';
        c.setTransform(1,0,0,1,0,0);
        c.fillRect(0, 0, canvas.width, canvas.height);
        if(p.deathTime.time === 0){
            if(tanks.length > 0){
                p.pos = tanks[0].pos;
            }
        }
        c.drawImage(map, p.pos.x - canvas.width/2, p.pos.y - canvas.height/2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        // c.fillStyle='red';
        // c.font="50px serif";
        // c.fillText(`союзники: ${allies.length}`, canvas.width/4, 50);
        // c.fillText(`противники: ${tanks.length}`, canvas.width/2, 50);
        // c.fillText(`fps: ${Math.floor(1000/(Date.now()-lastTime))}`, 10, 150);
        // c.fillText(`tanks.length = ${tanks.length}`, canvas.width*3/4, 50);
        // c.fillText(`x: ${p.pos.x}`, 10, 50);
        // c.fillText(`y: ${p.pos.y}`, 10, 100);
        exps.forEach((e, i)=>{
            if(checkCollisionPoint(p, e) && p.health.cur > 0){
                if(e.type === 'health') {
                    p.health.cur = Math.min(p.health.max, p.health.cur + 60);
                    exps.splice(i, 1);
                }
                else{
                    p.exp++;
                    if(p.exp>=p.level.need){
                        p.level.cur++;
                        p.exp%=p.level.need;
                        p.level.need++;
                        on_level_up(p.level.cur + 1);
                        setGainState();
                    }
                    exps.splice(i, 1);
                }
            }
            else 
            if(Math.sqrt(Math.pow(e.x - p.pos.x, 2) + Math.pow(e.y - p.pos.y, 2)) < COLLECT_RANGE){
                if(e.x < p.pos.x){
                    e.x++;
                }
                if(e.x > p.pos.x){
                    e.x--;
                }
                if(e.y < p.pos.y){
                    e.y++;
                }
                if(e.y > p.pos.y){
                    e.y--;
                }
            }
            let dr_img = exp_image;
            if(e.type === 'health') dr_img = health_img;
            c.drawImage(dr_img, 0, 0, dr_img.width, dr_img.height, -p.pos.x+canvas.width/2+ e.x-20,-p.pos.y+canvas.height/2+ e.y-20, 40, 40);
            // c.fillRect(-p.pos.x+canvas.width/2+ e.x-10,-p.pos.y+canvas.height/2+ e.y-10, 20, 20);
        })
        lastTime = Date.now();
        // c.drawImage(hull, 0, 0, hull.width, hull.height, -p.pos.x+secondPos.x+canvas.width/2, -p.pos.y+secondPos.y+canvas.height/2, hullSize.w, hullSize.h);
        /*
            логика противников
        */
        tanks.forEach((tank, i)=>{
            let ts, tks;
            // tank.angle.gun++; //поворот башни
            if(!tank.deathTime.active){
                let dx, lA = tank.angle.hull;
            tank.angle.hull%=360;
            let enemy = undefined, maxDist = canvas.width*3;
            allies.forEach(t => {
                if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                    +
                    Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) ) 
                    < Math.pow(maxDist, 2)){
                        maxDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                        +
                        Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) )
                        enemy = t;
                    }
            })
            if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    +
                    Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    < Math.pow(maxDist, 2) && p.health.cur > 0){
                        maxDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                        +
                        Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) )
                        enemy = p;
                    }


            
                if(enemy != undefined){
                        // let nearesEntity = enemy, nearsetDist = maxDist;
                        // allies.forEach(t=>{
                        //     if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                        //     +
                        //     Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) ) 
                        //     < Math.pow(nearsetDist, 2)){
                        //         nearsetDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                        //         +
                        //         Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) )
                        //         nearesEntity = t;
                        //     }
                        // })
                        // if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                        //     +
                        //     Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                        //     < Math.pow(nearsetDist, 2)){
                        //         nearsetDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                        //         +
                        //         Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) )
                        //         nearesEntity = p;
                        //     }
                    dx = enemy.pos.x-tank.pos.x;
                    // let isDist = (
            
                    //     Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    //     +
                    //     Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    //     > Math.pow(p.drawnSize*distStop, 2) || 1;
                    let ka = Math.atan((enemy.pos.y-tank.pos.y)/(dx))*180/Math.PI+90;//Math.floor(Math.atan((p.pos.y-tank.pos.y)/(dx))*180/Math.PI+90);
                    if(dx < 0) ka+=180;
                    ka = Math.floor(ka);
                    if(tank.isFiregun){
                        let mKa = Math.abs(tank.angle.gun+tank.angle.hull - ka)
                        if(tank.angle.gun+tank.angle.hull < ka )
                            if(mKa < tank.rotateGunSpeed*3)
                            tank.angle.gun+=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                            else
                            tank.angle.gun+=tank.rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                        else if(tank.angle.gun+tank.angle.hull > ka)
                            if(mKa < tank.rotateGunSpeed*3)
                                tank.angle.gun-=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                            else
                                tank.angle.gun-=tank.rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                    }
                    else{
                        if(tank.angle.gun+tank.angle.hull < ka )
                            tank.angle.gun+=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                        else if(tank.angle.gun+tank.angle.hull > ka)
                            tank.angle.gun-=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                    }
                if(tank.isFreezegun){
                    if(tank.frCD.t == 0 && tank.reload.t <= tank.reload.mTime - 30 && tank.frShot) 
                    {
                        freezeGunBullets.push({
                            pos: {
                                x: tank.pos.x+(((tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y+tank.shiftGun.back-tank.shiftGun.straight)*tank.drawnSize/tank.gun.height+21)*Math.sin((tank.angle.hull+tank.angle.gun)*Math.PI/180)),
                                y: tank.pos.y-(((tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.hull].hull.border.y)*tank.drawnSize/tank.gun.height+21)*Math.cos((tank.angle.hull+tank.angle.gun)*Math.PI/180)) //( tanksParams[tank.nameImg.gun].gun.border.y+tank.shiftGun.back-tank.shiftGun.straight)
                                //-tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height
                            },
                            angle: tank.angle.hull+tank.angle.gun,
                            team: teams.enemies,
                            time: tank.mTimeFBullets,
                            damageT: tank.damageT
                        });
                        tank.reload.t+= 30;
                        if(tank.reload.t >= tank.reload.mTime - 10){
                            tank.reload.t = tank.reload.mTime;
                            tank.frShot = false;
                        }
                        tank.shiftGun.state=true;
                        tank.shiftGun.back = 10;
                        tank.shiftGun.straight = 10;
                        tank.frCD.t = tank.frCD.mTime;
                    }
                }
                else
                if(tank.isRicochet){
                    if(tank.rickCD.t == 0 && tank.reload.t <= tank.reload.mTime - tank.rickCD.mTime && tank.rickoShot) 
                    {
                        ricochetBullets.push({
                            pos: {
                                x: tank.pos.x+(((tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y+tank.shiftGun.back-tank.shiftGun.straight)*tank.drawnSize/tank.gun.height+17)*Math.sin((tank.angle.hull+tank.angle.gun)*Math.PI/180)),
                                y: tank.pos.y-(((tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.hull].hull.border.y)*tank.drawnSize/tank.gun.height+17)*Math.cos((tank.angle.hull+tank.angle.gun)*Math.PI/180)) //( tanksParams[tank.nameImg.gun].gun.border.y+tank.shiftGun.back-tank.shiftGun.straight)
                                //-tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height
                            },
                            angle: tank.angle.hull+tank.angle.gun,
                            team: teams.enemies,
                            time: tank.mTimeRBullets
                        });
                        tank.reload.t+= 60;
                        if(tank.reload.t >= tank.reload.mTime){
                            tank.reload.t = tank.reload.mTime;
                            tank.rickoShot = false;
                        }
                        tank.shiftGun.state=true;
                        tank.rickCD.t = tank.rickCD.mTime*3;
                    }
                }
                else
                if(tank.isMGun && ((Math.random()>0.7 && !tank.MGActive && tank.reload.t == 0) || tank.MGActive)  && !tank.isTesla && !tank.isRicochet){
                
                        tank.MGActive = true;
                        if(tank.endMG==false)
                        {if(tank.SMGParams.t < tank.SMGParams.mTime){
                            tank.SMGParams.t++;
                        }
                        else if(tank.reload.t < tank.reload.mTime)
                        {tank.damageT = 2;
                        for(let j = 0; j < 1; j++){
                            ts =[getBorders2(p)], tks = [p];
                            tanks.filter(t=>{return (
        
                                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                +
                                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                < Math.pow(MGunRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                allies.filter(t=>{return (
                
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(MGunRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                            let isFound = false, tk=undefined;
                            
                            let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                            while(!isFound && l < MGunRange){
                                by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
                                // console.log(bx, by);
                                tk = tks.filter((t, i)=>{
                                    tk = tks[i];
                                    c.beginPath();
                                    c.moveTo(ts[i][0].x, ts[i][0].y);
                                    c.lineTo(ts[i][1].x, ts[i][1].y);
                                    c.lineTo(ts[i][2].x, ts[i][2].y);
                                    c.lineTo(ts[i][3].x, ts[i][3].y);
                                    c.lineTo(ts[i][0].x, ts[i][0].y);
                                    c.closePath();
                                    return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
                                });
                                if(pointCollisionMap({x:bx+tank.pos.x, y: by+tank.pos.y})) break
                                isFound = tk.length>0;
                                l+=2;
                            }
                            // if(isFound) console.log(`hit at ${bx} ${by}`)
                            // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                            if(isFound){
                                if(tk[0].team != tank.team)
                                tk[0].health.cur-=0.5;
                                // if(tk[0].health.cur <= 0) tank.health.cur=tank.health.max;
                            }
                            tank.MGSize = (Math.sqrt(bx*bx+by*by) -(tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y)*tank.drawnSize/tank.gun.height);
                            // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
                            // tank.reload.t=tank.reload.mTime;
                            // tank.isFlash.state=true;
                            tank.shiftGun.state=true;
                            tank.reload.t+=0.25;
                            if(tank.reload.t == tank.reload.mTime){
                                tank.endMG = true;
                            }
                    }}}
                    }
                else
                if(tank.isFiregun && tank.reload.t < tank.reload.mTime && !tank.firegunCD &&!tank.isMGun  && !tank.isTesla && !tank.isRicochet){
                    tank.attackRange = tanksSize + (tank.realSize.gun.center.y-tank.shiftGun.back)*tank.drawnSize/tank.gun.height;
                    tank.attackRange*=0.95;
                    tank.endFG.isActive=false;
                    tank.firegunActive = 1;
                    tank.fireGunSize = 1;
                    tank.attackRange = tanksSize + (p.realSize.gun.center.y-p.shiftGun.back+p.shiftGun.straight)*p.drawnSize/p.gun.height;
                    for(let j = 0; j < 1; j++){
                        let attacked = [];
                        ts =[getBorders2(p)], tks = [p];
                        tanks.filter(t=>{return (
                
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(tank.attackRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(tank.attackRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        let isFound = false, tk=undefined;
                        
                        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                        while(!isFound && l < tank.attackRange){
                            if(tank.countShots == 1){
                                by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
                            }
                            else{
                            by = -Math.cos((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                            bx = l*Math.sin((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180);
                            }   
                            // console.log(bx, by);
                            tk = tks.filter((t, i)=>{
                                tk = tks[i];
                                c.beginPath();
                                c.moveTo(ts[i][0].x, ts[i][0].y);
                                c.lineTo(ts[i][1].x, ts[i][1].y);
                                c.lineTo(ts[i][2].x, ts[i][2].y);
                                c.lineTo(ts[i][3].x, ts[i][3].y);
                                c.lineTo(ts[i][0].x, ts[i][0].y);
                                c.closePath();
                                return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
                            });
                            if(tk.length > 0)
                            {let res = false;
                            attacked.forEach(t=>{
                                res||=(t.pos.x == tk[0].pos.x && t.pos.y == tk[0].pos.y);
                            })
                            if(!res){
                                attacked.push(tk[tk.length - 1]);
                                // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
                            }}
                            if(pointCollisionMap({x:bx+tank.pos.x, y: by+tank.pos.y})) break
                            // isFound = tk.length>0;
                            l+=1;
                        }
                        // if(isFound) console.log(`hit at ${bx} ${by}`)
                        // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                        // if(isFound){
                        //     if(tk[0].team != tank.team)
                        //     {tk[0].health.cur-=tank.damageT;
                        //     }
                        //     // if(tk[0].health.cur <= 0) tank.health.cur=tank.health.max;
                        // }
                        tank.fireGunSize = (Math.sqrt((bx-Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180))*(bx-Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180))+(by-(-Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)))*(by-(-Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)))) -(tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y)*tank.drawnSize/tank.gun.height*0) / tank.attackRange;
                        attacked.forEach(t=>{
                            // console.log(tank.damageT)
                            if(t.team != tank.team)
                            {t.health.cur-=tank.damageT;
                                t.temp+=6;
                                if(t.temp > 800) t.temp = 800;
                                t.attackedBF = true;}
                            else{
                                if(t.temp < 0) {t.temp+=4;
                                if(t.temp > 0) t.temp = 0;}
                            }
                            // console.log(t)
                        });
                        // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
                        
                        // tank.reload.t=tank.reload.mTime;
                        // tank.isFlash.state=true;
                        // tank.shiftGun.state=true;
                        tank.reload.t+=tank.firegunSpeed;
                        if(tank.reload.t >= tank.reload.mTime){
                            tank.fireParams.f = 0;
                            tank.firegunCD = true;
                            tank.firegunActive = false;
                            tank.reload.t = tank.reload.mTime;
                            tank.endFG.isActive=true;
                            tank.endFG.f=tank.endFG.start;
                        }
                }
                }
                else if(tank.isTesla){
                    if(tank.teslaActive == false && tank.reload.t == 0)
                    {
                        tank.teslaReload=1;
                    }
                    
                }
                else if(tank.reload.t==0 && !tank.isFiregun && !tank.isMGun && !tank.isTesla && !tank.isRicochet){
                    if(Math.random() > 0.4){
                        ts =[getBorders2(p)], tks = [p];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        for(let j = 0; j < tank.countShots; j++){
                        let isFound = false, tk=undefined;
                        
                        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                        while(!isFound && l < attackRangeEneimes){
                            if(tank.countShots == 1){
                                by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
                            }
                            else{
                            by = -Math.cos((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                            bx = l*Math.sin((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180);
                            }   
                            // console.log(bx, by);
                            tk = tks.filter((t, i)=>{
                                tk = tks[i];
                                c.beginPath();
                                c.moveTo(ts[i][0].x, ts[i][0].y);
                                c.lineTo(ts[i][1].x, ts[i][1].y);
                                c.lineTo(ts[i][2].x, ts[i][2].y);
                                c.lineTo(ts[i][3].x, ts[i][3].y);
                                c.lineTo(ts[i][0].x, ts[i][0].y);
                                c.closePath(); 
                                return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
                            });
                            if(pointCollisionMap({x: bx+tank.pos.x, y: by+tank.pos.y})) break;
                            isFound = tk.length>0;
                            l+=0.1;
                        }
                        // if(isFound) console.log(`hit at ${bx} ${by}`)
                        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                        
                        if(tank.isThunder){
                            tks.filter(t=>{
                                let box = getBorders2(t);
                                c.beginPath();
                                c.moveTo(box[0].x, box[0].y);
                                c.lineTo(box[1].x, box[1].y);
                                c.lineTo(box[2].x, box[2].y);
                                c.lineTo(box[3].x, box[3].y);
                                c.lineTo(box[0].x, box[0].y);
                                c.closePath();
                                return (

                                    // Math.pow(box[0].x-tank.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[0].y-tank.pos.y-by, 2) <= Math.pow(tank.bulletParams.size*2, 2) ||
                                    // Math.pow(box[1].x-tank.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[1].y-tank.pos.y-by, 2) <= Math.pow(tank.bulletParams.size*2, 2) ||
                                    // Math.pow(box[2].x-tank.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[2].y-tank.pos.y-by, 2) <= Math.pow(tank.bulletParams.size*2, 2) ||
                                    // Math.pow(box[3].x-tank.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[3].y-tank.pos.y-by, 2) <= Math.pow(tank.bulletParams.size*2, 2)
                                    c.isPointInPath(bx+tank.pos.x, by+tank.pos.y) ||
                                    c.isPointInPath(bx+tank.pos.x + tank.bulletParams.size * thunderSize / 2 , by+tank.pos.y) ||
                                    c.isPointInPath(bx+tank.pos.x + tank.bulletParams.size * thunderSize / 2 / Math.sqrt(2), by+tank.pos.y + tank.bulletParams.size * thunderSize / 2 / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+tank.pos.x, by+tank.pos.y  + tank.bulletParams.size * thunderSize / 2 ) ||
                                    c.isPointInPath(bx+tank.pos.x - tank.bulletParams.size * thunderSize / 2 , by+tank.pos.y) ||
                                    c.isPointInPath(bx+tank.pos.x - tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+tank.pos.y - tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+tank.pos.x, by+tank.pos.y  - tank.bulletParams.size * thunderSize / 2 ) ||
                                    c.isPointInPath(bx+tank.pos.x - tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+tank.pos.y + tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+tank.pos.x + tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+tank.pos.y - tank.bulletParams.size * thunderSize / 2  / Math.sqrt(2))
                                    );
                            }).forEach(t=>{
                                if(t.team != tank.team)
                                t.health.cur-=tank.damageT;
                            })
                        }
                        else
                        if(isFound){
                                if(tk[0].team != tank.team)
                                tk[0].health.cur-=tank.damageT;
                        } //tank.bulletParams.size
                        if(tank.isThunder){
                            bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime, size: thunderSize});
                        }
                        else
                        {bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: p.bulletParams.mTime});}

                        // if(isFound){
                        //     if(tk[0].team != tank.team)
                        //         tk[0].health.cur-=damage;
                        // }
                        // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
                        tank.reload.t=tank.reload.mTime;
                        tank.isFlash.state=true;
                        tank.shiftGun.state=true;
        
                    }
                }
                    }
                    if(1){ //isDist
                        tank.isMove=true;
                        // if(ka == 0 || ka == 360) {if(tank.angle.hull < 180) {tank.angle.hull--;} else tank.angle.hull++;}
                        
                        // else{
                        if(tank.goStraight.cooldown == 0){
                            if(!tank.goStraight.active && !tank.rotateOnPlace.active && !tank.goBack.active) {
                                if(Math.random()> 0.6) {
                                tank.goStraight.active=true;
                                tank.goStraight.time = tank.goStraight.mTime;
                                }
                            }
                        }
                        else{
                            tank.goStraight.cooldown--;
                        }
                            
                            
                        if(tank.rotateOnPlace.active) {tank.angle.hull+=tank.rotateOnPlace.state*(tank.temp<0?(800+tank.temp)/800:1);
                            if(collisionMap(tank)) tank.angle.hull-=tank.rotateOnPlace.state*(tank.temp<0?(800+tank.temp)/800:1);
                            ts =[getBorders2(p)], tks = [p];
                            if(p.health.cur <= 0) ts = [], tks = [];
                            tanks.filter(t=>{return (
            
                                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                +
                                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                            
                                allies.filter(t=>{return (
            
                                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                +
                                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                            tks.filter(t=>{return ((
                                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                +
                                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                                if(checkCollision(tank, t) || checkCollision(t, tank)){
                                    tank.angle.hull-=tank.rotateOnPlace.state;
                            }
                            })}
                        else if(tank.goStraight.active && !tank.goBack.active){
                            tank.goStraight.time--;
                            if(tank.goStraight.time == 0) {tank.goStraight.active=false; 
                                tank.goStraight.cooldown = tank.goStraight.mTime;}
                        }
                        else{
                            if(tank.angle.hull < ka){
                                tank.angle.hull+=1*(tank.temp<0?(800+tank.temp)/800:1);
                                if(collisionMap(tank)) tank.angle.hull-=1*(tank.temp<0?(800+tank.temp)/800:1);
                                ts =[getBorders2(p)], tks = [p];
                                if(p.health.cur <= 0) ts = [], tks = [];
                                tanks.filter(t=>{return (
            
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                            
                                allies.filter(t=>{return (
            
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                tks.filter(t=>{return ((
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                                        if(checkCollision(tank, t) || checkCollision(t, tank)){
                                            tank.angle.hull-=1*(tank.temp<0?(800+tank.temp)/800:1);
                                        }
                                    })
                            }
                            if(tank.angle.hull > ka){
                                tank.angle.hull-=1*(tank.temp<0?(800+tank.temp)/800:1);
                                if(collisionMap(tank)) tank.angle.hull+=1*(tank.temp<0?(800+tank.temp)/800:1);
                                ts =[getBorders2(p)], tks = [p];
                                if(p.health.cur <= 0) ts = [], tks = [];
                                tanks.filter(t=>{return (
                
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                
                                    allies.filter(t=>{return (
                
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                tks.filter(t=>{return ((
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                                    if(checkCollision(tank, t) || checkCollision(t, tank)){
                                        tank.angle.hull+=1*(tank.temp<0?(800+tank.temp)/800:1);
                                    }
                                })
                            }
                        }
                        // }
                        tanks.filter(t=>{return ((
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(p.drawnSize*2, 2)) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(t=>{
                            if(checkCollision(tank, t) || checkCollision(t, tank)){
                            tank.angle.hull=lA;
                        }
                        })
                        if(tank.rotateOnPlace.active == false){
                            tank.pos.y-=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                            tank.pos.x+=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                            if(collisionMap(tank)){
                                tank.pos.y+=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                                tank.pos.x-=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                                tank.goBack.active=!tank.goBack.active;
                                tank.goBack.time=tank.goBack.mTime;
                            }
                            else{
                                ts =[getBorders2(p)], tks = [p];
                                if(p.health.cur <= 0) ts = [], tks = [];
                                tanks.filter(t=>{return (
                
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                
                                    allies.filter(t=>{return (
                
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                                tks.filter(t=>{return ((
                                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                                    +
                                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                                    < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                                    if(checkCollision(tank, t) || checkCollision(t, tank)){
                                    tank.pos.y+=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                                    tank.pos.x-=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                                    tank.goBack.active=true;
                                    tank.goBack.time=tank.goBack.mTime;
                                }
                                })
                            }}
                        }
                        
                    tank.updateReload(p);
                    }
            }
            tank.drawHull(p); //рисую
        if(tank.health.cur<=0 ) tank.deathTime.active=true; //если здоровье <= 0, удаляю объект
        if(tank.deathTime.time == 0) {
            let type = 'exp';
            if(Math.random() > 0.8){
                type = 'health'
            }
            exps.push({x:tank.pos.x, y: tank.pos.y, team: teams.enemies, type: type});
            tanks.splice(i, 1);} //если здоровье <= 0, удаляю объект
            tank = null;
        });
        allies.forEach((tank, i)=>{
            let ts, tks;
            // tank.angle.gun++; //поворот башни
            if(!tank.deathTime.active){
            tank.angle.hull%=360;
            let dx, lA = tank.angle.hull;
            let enemy = undefined, maxDist = canvas.width*3;
            tanks.forEach(t => {
                if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                    +
                    Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) ) 
                    < Math.pow(maxDist, 2)){
                        maxDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                        +
                        Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) )
                        enemy = t;
                    }
            })
            if(enemy != undefined){
                // let nearesEntity = enemy, nearsetDist = maxDist;
                // allies.forEach(t=>{
                //     if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                //     +
                //     Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) ) 
                //     < Math.pow(nearsetDist, 2)){
                //         nearsetDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-t.pos.x-t.realSize.hull.center.x*t.drawnSize/t.hull.width, 2)
                //         +
                //         Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-t.pos.y-t.realSize.hull.center.y*t.drawnSize/t.hull.width, 2) )
                //         nearesEntity = t;
                //     }
                // })
                // if((Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                //     +
                //     Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                //     < Math.pow(nearsetDist, 2)){
                //         nearsetDist = Math.sqrt(Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                //         +
                //         Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) )
                //         nearesEntity = p;
                //     }
            dx = enemy.pos.x-tank.pos.x;
            let ka = Math.atan((enemy.pos.y-tank.pos.y)/(dx))*180/Math.PI+90;//Math.floor(Math.atan((p.pos.y-tank.pos.y)/(dx))*180/Math.PI+90);
            if(dx < 0) ka+=180;
            ka = Math.floor(ka);
            if(tank.isFiregun){
                let mKa = Math.abs(tank.angle.gun+tank.angle.hull - ka)
                if(tank.angle.gun+tank.angle.hull < ka )
                    if(mKa < tank.rotateGunSpeed*3)
                    tank.angle.gun+=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                    else
                    tank.angle.gun+=tank.rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                else if(tank.angle.gun+tank.angle.hull > ka)
                    if(mKa < tank.rotateGunSpeed*3)
                        tank.angle.gun-=rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
                    else
                        tank.angle.gun-=tank.rotateGunSpeed*(tank.temp<0?(800+tank.temp)/800:1);
            }
            else{
                if(tank.angle.gun+tank.angle.hull < ka )
                    tank.angle.gun+=rotateGunSpeed;
                else if(tank.angle.gun+tank.angle.hull > ka)
                    tank.angle.gun-=rotateGunSpeed;
            }
                if(tank.isFiregun && tank.reload.t < tank.reload.mTime && !tank.firegunCD){
                    tank.attackRange = tanksSize + (tank.realSize.gun.center.y-tank.shiftGun.back)*tank.drawnSize/tank.gun.height;
                    tank.attackRange*=0.95;
                    tank.endFG.isActive=false;
                    tank.firegunActive = 1;
                    tank.attackRange = tanksSize + (p.realSize.gun.center.y-p.shiftGun.back+p.shiftGun.straight)*p.drawnSize/p.gun.height;
                    for(let j = 0; j < 1; j++){
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
                
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(tank.attackRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(tank.attackRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        let isFound = false, tk=undefined;
                        
                        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                        while(!isFound && l < tank.attackRange){
                            if(tank.countShots == 1){
                                by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
                            }
                            else{
                            by = -Math.cos((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                            bx = l*Math.sin((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180);
                            }   
                            // console.log(bx, by);
                            tk = tks.filter((t, i)=>{
                                tk = tks[i];
                                c.beginPath();
                                c.moveTo(ts[i][0].x, ts[i][0].y);
                                c.lineTo(ts[i][1].x, ts[i][1].y);
                                c.lineTo(ts[i][2].x, ts[i][2].y);
                                c.lineTo(ts[i][3].x, ts[i][3].y);
                                c.lineTo(ts[i][0].x, ts[i][0].y);
                                c.closePath();
                                return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
                            });
                            if(pointCollisionMap({x:bx+tank.pos.x, y: by+tank.pos.y})) break
                            isFound = tk.length>0;
                            l+=2;
                        }
                        // if(isFound) console.log(`hit at ${bx} ${by}`)
                        // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                        if(isFound){
                            if(tk[0].team != tank.team)
                            {tk[0].health.cur-=tank.damageT;
                            }
                            // if(tk[0].health.cur <= 0) tank.health.cur=tank.health.max;
                        }
                        // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
                        
                        // tank.reload.t=tank.reload.mTime;
                        // tank.isFlash.state=true;
                        // tank.shiftGun.state=true;
                        tank.reload.t+=tank.firegunSpeed;
                        if(tank.reload.t >= tank.reload.mTime){
                            tank.fireParams.f = 0;
                            tank.firegunCD = true;
                            tank.firegunActive = false;
                            tank.reload.t = tank.reload.mTime;
                            tank.endFG.isActive=true;
                            tank.endFG.f=tank.endFG.start;
                        }
                }
                }
                else if(tank.reload.t==0 && !tank.isFiregun){
                    if(Math.random() > 0.4){
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        for(let j = 0; j < tank.countShots; j++){
                        let isFound = false, tk=undefined;
                        
                        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                        while(!isFound && l < attackRangeEneimes){
                            if(tank.countShots == 1){
                                by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
                            }
                            else{
                            by = -Math.cos((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                            bx = l*Math.sin((tank.angle.gun+tank.angle.hull+((j-(tank.countShots-1)/2)/(tank.countShots-1))*angleShiftMultishots)*Math.PI/180);
                            }   
                            // console.log(bx, by);
                            tk = tks.filter((t, i)=>{
                                tk = tks[i];
                                c.beginPath();
                                c.moveTo(ts[i][0].x, ts[i][0].y);
                                c.lineTo(ts[i][1].x, ts[i][1].y);
                                c.lineTo(ts[i][2].x, ts[i][2].y);
                                c.lineTo(ts[i][3].x, ts[i][3].y);
                                c.lineTo(ts[i][0].x, ts[i][0].y);
                                c.closePath(); 
                                return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
                            });
                            if(pointCollisionMap({x: bx+tank.pos.x, y: by+tank.pos.y})) break;
                            isFound = tk.length>0;
                            l+=0.1;
                        }
                        // if(isFound) console.log(`hit at ${bx} ${by}`)
                        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                        if(isFound){
                            if(tk[0].team != tank.team)
                                tk[0].health.cur-=damage;
                        }
                        bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
                        tank.reload.t=p.reload.mTime;
                        tank.isFlash.state=true;
                        tank.shiftGun.state=true;
        
                    }
                }
                    tank.reload.t=tank.reload.mTime;
                }
            tank.updateReload(p);
            if(1){ //isDist
                tank.isMove=true;
                // if(ka == 0 || ka == 360) {if(tank.angle.hull < 180) {tank.angle.hull--;} else tank.angle.hull++;}
                
                // else{
                    if(tank.goStraight.cooldown == 0){
                    if(!tank.goStraight.active && !tank.rotateOnPlace.active && !tank.goBack.active) {
                        if(Math.random()> 0.6) {
                        tank.goStraight.active=true;
                        tank.goStraight.time = tank.goStraight.mTime;
                        }
                    }
                }
                else{
                    tank.goStraight.cooldown--;
                }
                    
                    
                    if(tank.rotateOnPlace.active) {tank.angle.hull+=tank.rotateOnPlace.state*1;
                        if(collisionMap(tank)) tank.angle.hull-=tank.rotateOnPlace.state*1;
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        tks.filter(t=>{return ((
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                            if(checkCollision(tank, t) || checkCollision(t, tank)){
                                tank.angle.hull-=tank.rotateOnPlace.state*1;
                        }
                        })}
                    else if(tank.goStraight.active && !tank.goBack.active){
                        tank.goStraight.time--;
                        if(tank.goStraight.time == 0) {tank.goStraight.active=false; 
                            tank.goStraight.cooldown = tank.goStraight.mTime;}
                    }
                    else{
                        if(tank.angle.hull < ka){
                            tank.angle.hull+=1*1;
                            if(collisionMap(tank)) tank.angle.hull-=1*1;
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        tks.filter(t=>{return ((
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                            if(checkCollision(tank, t) || checkCollision(t, tank)){
                                tank.angle.hull-=1*1;
                        }
                        })
                        }
                        if(tank.angle.hull > ka){
                            tank.angle.hull-=1*1;
                            if(collisionMap(tank)) tank.angle.hull+=1*1;
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        tks.filter(t=>{return ((
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                            if(checkCollision(tank, t) || checkCollision(t, tank)){
                                tank.angle.hull+=1*1;
                        }
                        })
                        }
                    }
                // }
                tanks.filter(t=>{return ((
                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                    +
                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                    < Math.pow(p.drawnSize*2, 2)) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(t=>{
                    if(checkCollision(tank, t) || checkCollision(t, tank)){
                    tank.angle.hull=lA;
                }
                })
                if(tank.rotateOnPlace.active == false){
                    tank.pos.y-=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                    tank.pos.x+=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                    if(collisionMap(tank)){
                        tank.pos.y+=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                        tank.pos.x-=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                        tank.goBack.active=!tank.goBack.active;
                        tank.goBack.time=tank.goBack.mTime;
                        if(collisionMap(tank)){
                            tank.health.cur=-1;
                            tank.deathTime.time=0;
                        }
                    }
                    else{
                        ts =[getBorders2(p)], tks = [p];
                        if(p.health.cur <= 0) ts = [], tks = [];
                        tanks.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        
                            allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(attackRangeEneimes*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        tks.filter(t=>{return ((
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                            < Math.pow(t.drawnSize*2, 2));}).forEach(t=>{
                            if(checkCollision(tank, t) || checkCollision(t, tank)){
                            tank.pos.y+=Math.cos(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                            tank.pos.x-=Math.sin(tank.angle.hull*Math.PI/180)*tank.speed*tank.speedFactor*(tank.goBack.active?-0.5:1)*(tank.temp<0?(800+tank.temp)/800:1);
                            tank.goBack.active=true;
                            tank.goBack.time=tank.goBack.mTime;
                        }
                        })
                    }}
                }
            }
            
        }
            tank.drawHull(p); //рисую
            if(tank.health.cur<=0 ) tank.deathTime.active=true; //если здоровье <= 0, удаляю объект
            if(tank.deathTime.time == 0){
                let type = 'exp';
                if(Math.random() > 0.8){
                    type = 'health'
                }
                exps.push({x:tank.pos.x, y: tank.pos.y, team: teams.allies, type: type});
                allies.splice(i, 1);} //если здоровье <= 0, удаляю объект
                tank = null;
        });
        if(p.health.cur <= 0) p.deathTime.active = true;
        if(p.deathTime.time !== 0)
        p.drawHull();
        if(p.isLaserActive){
            p.updateLaser();
        }
        tanks.forEach(t=>{if(t.isLaserActive) t.updateLaser(p)});
        allies.forEach(t=>{if(t.isLaserActive) t.updateLaser(p)});
        teslasLasers.forEach((t, i)=>{
            //t = {pos: {x, y}, angle, state: 0, mState: 5, fr}
            // this.teslaParams = {timer: 0, fr: 5, f: 0, mf: 7};

            // teslasLasers.push({pos: {x: p.pos.x -tanksSize*0.25, y: p.pos.y-tanksSize-(tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)*p.drawnSize/p.gun.height - (p.teslaSize-1)*p.drawnSize,
            // size: p.teslaSize*p.drawnSize, angle: p.angle.gun+p.angle.hull, timer: 0, fr: 5, f: 0, mf: 7}});

            c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+t.pos.x, canvas.height/2-p.pos.y+t.pos.y);
            c.rotate(t.angle*Math.PI/180);
            c.drawImage(p.teslaImg[t.f], 0, 0, p.teslaImg[t.f].width, p.teslaImg[t.f].height,  -tanksSize*0.25, t.shiftY, p.drawnSize/2, t.size);
            t.timer++;
            if(t.timer % t.fr == 0){
                t.timer = 0;
                t.f++;
                if(t.f > t.mf) {
                    // if(t.start == false){
                    //     t.start = true;
                    //     t.f = 6;
                    // }
                    // else
                    // {t.f = 1}
                    teslasLasers.splice(i, 1);
                };
            }
            c.setTransform(1, 0, 0, 1, 0 ,0);

        })
        // showBorders(p);
        // let alTanks = allTanks(p, tanks, allies);
        // allTanks(p, tanks, allies).filter(t=>t.isRay).forEach(t=>{
            
        // })
        if(p.isRay && p.health.cur > 0){
            if(p.rayCd.cur <= 0)
            {let ts =[], tks = [];
            [...tanks, ...allies].filter(tank=>{return (

                Math.pow(tank.pos.x+tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(tank.pos.y+tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(rayRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
            let isFound = false, tk=undefined;
            let l = 0;
            let bx = 0, by = 0;
            if(p.rayCd.cur == 0 || p.rayCount == 2)
            {while(!isFound && l < rayRange){
                by = -Math.cos((p.rayAngle)*Math.PI/180)*l;
                bx = l*Math.sin((p.rayAngle)*Math.PI/180);

                // console.log(bx, by);
                tk = tks.filter((t, i)=>{
                    tk = tks[i];
                    c.beginPath();
                    c.moveTo(ts[i][0].x, ts[i][0].y);
                    c.lineTo(ts[i][1].x, ts[i][1].y);
                    c.lineTo(ts[i][2].x, ts[i][2].y);
                    c.lineTo(ts[i][3].x, ts[i][3].y);
                    c.lineTo(ts[i][0].x, ts[i][0].y);
                    c.closePath();
                    return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
                });
                if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
                isFound = tk.length>0;
                l+=1;
            }
            tk.forEach(t=>{
                if(t.team!=p.team){
                    t.health.cur-=p.rayDamage;
                }
            })
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
            c.rotate((p.rayAngle)*Math.PI/180);

            c.drawImage(ray, 0, 0, ray.width, ray.height, -raySize/2, 0, raySize, -l);
            if(l < rayRange - 1)
            c.drawImage(rayExps[p.rayAnim.cur], 0, 0, rayExps[0].width, rayExps[0].height, -rayExpSize/2, -l+rayExpSize/2, rayExpSize, -rayExpSize);
            c.setTransform(1,0,0,1,0,0);}
            l = 0;
            isFound = false;
            tk = [];
            if(p.rayCd.cur == -1 || p.rayCount == 2)
            {while(!isFound && l < rayRange){
                by = -Math.cos((p.rayAngle+180)*Math.PI/180)*l;
                bx = l*Math.sin((p.rayAngle+180)*Math.PI/180);

                // console.log(bx, by);
                tk = tks.filter((t, i)=>{
                    tk = tks[i];
                    c.beginPath();
                    c.moveTo(ts[i][0].x, ts[i][0].y);
                    c.lineTo(ts[i][1].x, ts[i][1].y);
                    c.lineTo(ts[i][2].x, ts[i][2].y);
                    c.lineTo(ts[i][3].x, ts[i][3].y);
                    c.lineTo(ts[i][0].x, ts[i][0].y);
                    c.closePath();
                    return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
                });
                if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
                isFound = tk.length>0;
                l+=1;
            }
            tk.forEach(t=>{
                if(t.team!=p.team){
                    t.health.cur-=30;
                }
            })
            c.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
            c.rotate((180+p.rayAngle)*Math.PI/180);
            c.drawImage(ray, 0, 0, ray.width, ray.height, -raySize/2, raySize, raySize, -l-20);
            if(l < rayRange - 1)
            c.drawImage(rayExps[p.rayAnim.cur], 0, 0, rayExps[0].width, rayExps[0].height, -50, -l+rayExpSize/2, 100, -100);
            //-raySize/2
            //0
            //raySize/2
            c.setTransform(1,0,0,1,0,0);}
            p.rayAngle+=3;
            if(p.rayAngle >= 180){
                if(p.rayCd.cur == 0) p.rayCd.cur = -1;
                else if(p.rayCd.cur == -1) p.rayCd.cur = p.rayCd.max;
            }
            p.rayAngle%=180;
            p.rayAnim.timer.v++;
            if(p.rayAnim.timer.v == p.rayAnim.timer.fr) {p.rayAnim.timer.v = 0;
            p.rayAnim.cur++; if(p.rayAnim.cur == p.rayAnim.max) p.rayAnim.cur = 0;}}
            else p.rayCd.cur--;
        }
        tanks.forEach(t=>{t.drawGun(p)});
        allies.forEach(t=>{t.drawGun(p)});
        if(p.deathTime.time !== 0)
        p.drawGun();
        tanks.forEach(t=>{t.drawEffects(p)});
        allies.forEach(t=>{t.drawEffects(p)});
        if(p.deathTime.time !== 0)
        p.drawEffects();
        if(p.bombardment.isActive && p.bombardment.cd.cur == 0 && p.health.cur > 0){
            let eB = tanks.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(canvas.height/2, 2);})[0]
            // let pos = eB?.pos;
            // console.log(pos);
            // c.fillStyle='red';
            if(eB){
                if(!p.bombardment.action.isActive){
                    p.bombardment.action.isActive=true;
                    p.bombardment.action.time=p.bombardment.action.mTime;
                    p.bombardment.enemy = eB;
                    p.bombardment.bombed = false;
                    p.bombardment.cd.cur = p.bombardment.cd.max+p.bombardment.action.mTime*1.5+p.bombardment.crosshair.max;
                    p.bombardment.crosshair.cur = p.bombardment.crosshair.max;
                }
            // c.fillRect(canvas.width/2-p.pos.x+pos.x, canvas.height/2-p.pos.y+pos.y, 30, 30);
            }
        }
        // showCrossair();
        bullets.forEach((b, i)=>{
            
            // c.fillRect(canvas.width/2-p.pos.x+b.x-10, canvas.height/2-p.pos.y+b.y-10, 20, 20);
            // if(b.flyTime > 0){
            //     b.y += -Math.cos(b.angle*Math.PI/180)*bulletSpeed;
            //     b.x += bulletSpeed*Math.sin(b.angle*Math.PI/180);
            //     b.flyTime--;
            // }
            // else{
            //     b.time--;
            //     if(b.time<=0){
            //         bullets.splice(i, 1);
            //     }
            // }

            // if(b.flyTime==0) c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+b.toPos.x, canvas.height/2-p.pos.y+b.toPos.y);
            // else 
            c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+b.x, canvas.height/2-p.pos.y+b.y);
            c.rotate(b.angle*Math.PI/180);
            c.drawImage(p.explosion[Math.floor(((p.bulletParams.mTime-b.time)/p.bulletParams.mTime)*maxExplosionFrames)], 0, 0, p.explosion[0].width, p.explosion[0].height, -p.bulletParams.size*(b.size?b.size:1)/2, -p.bulletParams.size*(b.size?b.size:1)/2, p.bulletParams.size*(b.size?b.size:1), p.bulletParams.size*(b.size?b.size:1));
            // p.isFlash.state=true;
            // p.isFlash.frame=Math.floor(((p.bulletParams.mTime-b.time)/p.bulletParams.mTime)*5);
            c.setTransform(1,0,0,1,0,0);
            b.time-=explosionSpeed;
            if(b.time<=0){
                bullets.splice(i, 1);
            }
        })
        let ts, tks;    
        ts =[getBorders2(p)], tks = [p];
        if(p.health.cur <= 0) ts = [], tks = [];
        tanks.forEach(f=>{
            ts.push(getBorders2(f)); tks.push(f);
        });
        allies.forEach(f=>{
            ts.push(getBorders2(f)); tks.push(f);
        });
        freezeGunBullets.forEach((b, i)=>{
            c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+b.pos.x, canvas.height/2-p.pos.y+b.pos.y);
            c.rotate((b.angle)*Math.PI/180);
            c.drawImage(freezeBullet, 0, 0, freezeBullet.width, freezeBullet.height, - ricoBulletSize,
            - ricoBulletSize, ricoBulletSize*2, ricoBulletSize*2)
            c.setTransform(1,0,0,1,0,0);
            b.pos.x+=freezeGunBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
            b.pos.y-=freezeGunBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
            let tk=undefined;
            tk = tks.filter((t, i)=>{
                tk = tks[i];
                c.beginPath();
                c.moveTo(ts[i][0].x, ts[i][0].y);
                c.lineTo(ts[i][1].x, ts[i][1].y);
                c.lineTo(ts[i][2].x, ts[i][2].y);
                c.lineTo(ts[i][3].x, ts[i][3].y);
                c.lineTo(ts[i][0].x, ts[i][0].y);
                c.closePath();
                return c.isPointInPath(b.pos.x, b.pos.y);
            });
            if(tk.length > 0) {
                if(tk[0].team != b.team){
                    tk[0].health.cur-=b.damageT;
                    if(tk[0].temp > -600)
                    tk[0].temp-=300;
                    if(tk[0].temp <= -800) {tk[0].temp = -800; tk[0].health.cur-=tk[0].health.max*0.13}
                }
                else{
                    if(tk[0].temp > 0) {tk[0].temp-=200;
                    if(tk[0].temp < 0) tk[0].temp = 0;}
                }
                b.time = 2;
                freezeGunBullets.splice(i, 1);
            }
            else if(pointCollisionMap(b.pos)){
                b.time = 2;
                freezeGunBullets.splice(i, 1);
                
            }
            b.time--;
            if(b.time == 0){
                freezeGunBullets.splice(i, 1);
            }

        })
        ricochetBullets.forEach((b, i)=>{
            // c.fillStyle = 'orange';
            // c.fillRect((canvas.width/2-p.pos.x)+b.pos.x - 10, (canvas.height/2-p.pos.y)+b.pos.y - 10, 20, 20);
            c.drawImage(ricoBullet, 0, 0, ricoBullet.width, ricoBullet.height, (canvas.width/2-p.pos.x)+b.pos.x - ricoBulletSize/2,
            (canvas.height/2-p.pos.y)+b.pos.y - ricoBulletSize/2, ricoBulletSize, ricoBulletSize)
            b.pos.x+=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
            b.pos.y-=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
            //bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
            
            // tanks.filter(t=>{return (

            //     Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-b.pos.x, 2)
            //     +
            //     Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-b.pos.y, 2) ) 
            //     < Math.pow(p.drawnSize, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
            // allies.filter(t=>{return (

            //     Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-b.pos.x, 2)
            //     +
            //     Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-b.pos.y, 2) ) 
            //     < Math.pow(p.drawnSize, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
            
            let tk=undefined;//bullet x, y; l - len of bullets path
                // console.log(bx, by);
            tk = tks.filter((t, i)=>{
                tk = tks[i];
                c.beginPath();
                c.moveTo(ts[i][0].x, ts[i][0].y);
                c.lineTo(ts[i][1].x, ts[i][1].y);
                c.lineTo(ts[i][2].x, ts[i][2].y);
                c.lineTo(ts[i][3].x, ts[i][3].y);
                c.lineTo(ts[i][0].x, ts[i][0].y);
                c.closePath();
                return c.isPointInPath(b.pos.x, b.pos.y);
            });
            // console.log(tk.length)
            let nAngle = undefined;
            if(tk.length > 0) {
                b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                if(tk[0].team != b.team){
                    tk[0].health.cur-=30;
                }
                // nAngle =  tk[0].angle.hull;
                // // console.log(`b angle:`, b.angle);
                // // console.log(`N angle:`, nAngle);
                // // b.angle=360-b.angle+nAngle;
                // b.angle=360-b.angle-2*nAngle;
                // if(b.angle < 0) b.angle+=360;
                // b.angle%=360;
                // // console.log(`bN angle:`, b.angle);
                // b.pos.x+=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                // b.pos.y-=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                // tk = tks.filter((t, i)=>{
                //     tk = tks[i];
                //     c.beginPath();
                //     c.moveTo(ts[i][0].x, ts[i][0].y);
                //     c.lineTo(ts[i][1].x, ts[i][1].y);
                //     c.lineTo(ts[i][2].x, ts[i][2].y);
                //     c.lineTo(ts[i][3].x, ts[i][3].y);
                //     c.lineTo(ts[i][0].x, ts[i][0].y);
                //     c.closePath();
                //     return c.isPointInPath(b.pos.x, b.pos.y);
                // });
                // if(tk.length > 0 || pointCollisionMap(b.pos)){
                //     b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                //     b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                //     b.angle-=180;
                //     if(b.angle < 0) b.angle+=360;
                //     b.angle%=360;
                // }
                // b.pos.x+=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                // b.pos.y-=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                // tk = tks.filter((t, i)=>{
                //     tk = tks[i];
                //     c.beginPath();
                //     c.moveTo(ts[i][0].x, ts[i][0].y);
                //     c.lineTo(ts[i][1].x, ts[i][1].y);
                //     c.lineTo(ts[i][2].x, ts[i][2].y);
                //     c.lineTo(ts[i][3].x, ts[i][3].y);
                //     c.lineTo(ts[i][0].x, ts[i][0].y);
                //     c.closePath();
                //     return c.isPointInPath(b.pos.x, b.pos.y);
                // });
                // if(tk.length > 0 || pointCollisionMap(b.pos)){
                //     ricochetBullets.splice(i, 1);
                // }
                // else{
                    
                // b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                // b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                // }
                b.time = 2;
                ricochetBullets.splice(i, 1);
            }
            else if(pointCollisionMap(b.pos)){
                b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                // b.angle=360-b.angle+nAngle;
                b.angle=360-b.angle;
                if(b.angle < 0) b.angle+=360;
                b.angle%=360;
                b.pos.x+=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                b.pos.y-=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                tk = tks.filter((t, i)=>{
                    tk = tks[i];
                    c.beginPath();
                    c.moveTo(ts[i][0].x, ts[i][0].y);
                    c.lineTo(ts[i][1].x, ts[i][1].y);
                    c.lineTo(ts[i][2].x, ts[i][2].y);
                    c.lineTo(ts[i][3].x, ts[i][3].y);
                    c.lineTo(ts[i][0].x, ts[i][0].y);
                    c.closePath();
                    return c.isPointInPath(b.pos.x, b.pos.y);
                });
                if(tk.length > 0 || pointCollisionMap(b.pos)){
                    b.angle-=180;
                    if(b.angle < 0) b.angle+=360;
                    b.angle%=360;
                }
                b.pos.x+=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                b.pos.y-=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                tk = tks.filter((t, i)=>{
                    tk = tks[i];
                    c.beginPath();
                    c.moveTo(ts[i][0].x, ts[i][0].y);
                    c.lineTo(ts[i][1].x, ts[i][1].y);
                    c.lineTo(ts[i][2].x, ts[i][2].y);
                    c.lineTo(ts[i][3].x, ts[i][3].y);
                    c.lineTo(ts[i][0].x, ts[i][0].y);
                    c.closePath();
                    return c.isPointInPath(b.pos.x, b.pos.y);
                });
                if(tk.length > 0 || pointCollisionMap(b.pos)){
                    ricochetBullets.splice(i, 1);
                }
                else{
                    
                b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
                b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
                }
            }
            
            b.time--;
            if(b.time == 0){
                ricochetBullets.splice(i, 1);
            }
            // if(tk.length > 0 || pointCollisionMap(b.pos)){
            //     tk.forEach(t=>{
            //         if(t.team == teams.enemies){
            //             // t.health.cur-=10;
            //         }
            //     })
            //     b.pos.x-=ricochetBulletsSpeed*Math.sin((b.angle)*Math.PI/180);
            //     b.pos.y+=ricochetBulletsSpeed*Math.cos((b.angle)*Math.PI/180);
            //     tk = tks.filter((t, i)=>{
            //         tk = tks[i];
            //         c.beginPath();
            //         c.moveTo(ts[i][0].x, ts[i][0].y);
            //         c.lineTo(ts[i][1].x, ts[i][1].y);
            //         c.lineTo(ts[i][2].x, ts[i][2].y);
            //         c.lineTo(ts[i][3].x, ts[i][3].y);
            //         c.lineTo(ts[i][0].x, ts[i][0].y);
            //         c.closePath();
            //         return c.isPointInPath(b.pos.x, b.pos.y);
            //     });
            //     if(tk.length > 0 || pointCollisionMap(b.pos)){
            //         ricochetBullets.splice(i, 1);
            //     }
            //     if(nAngle){
            //         console.log(b.angle);
            //         console.log(nAngle);
            //         // b.angle=360-b.angle+nAngle;
            //         b.angle=b.angle-2*nAngle;
            //         console.log(b.angle);
            //     }
            //     else b.angle+=90;
            //     b.angle%=360;
            //     // ricochetBullets.splice(i, 1);
            // }
                // if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break

        })
        if(p.bombardment.action.isActive && p.health.cur > 0){
            if(p.bombardment.crosshair.cur > 0){
                p.bombardment.crosshair.cur--;
                c.drawImage(bombCrosshair, 0, 0, bombCrosshair.width, bombCrosshair.height, canvas.width/2-p.pos.x+p.bombardment.enemy.pos.x-canvas.width*0.025-(p.bombardment.crosshair.cur/p.bombardment.crosshair.max)*canvas.width*0.15/2, canvas.height/2-p.pos.y+p.bombardment.enemy.pos.y-canvas.width*0.025-(p.bombardment.crosshair.cur/p.bombardment.crosshair.max)*canvas.width*0.15/2,
                 canvas.width*0.05+(p.bombardment.crosshair.cur/p.bombardment.crosshair.max)*canvas.width*0.15, canvas.width*0.05+(p.bombardment.crosshair.cur/p.bombardment.crosshair.max)*canvas.width*0.15);
            }
            else
            {
                p.bombardment.action.time--;
                if(!p.bombardment.bombed && (p.bombardment.action.time)/p.bombardment.action.mTime+planeSize/canvas.height <= (canvas.height/2-p.pos.y+p.bombardment.enemy.pos.y)/canvas.height){
                    p.bombardment.enemy.health.cur-=p.flyDamage;
                    p.bombardment.bombed=true;
                    // bullets.push({x: p.bombardment.enemy.pos.x, y: p.bombardment.enemy.pos.y, angle: 0, time: p.bulletParams.mTime,
                    //      size: 2});
                    p.bombardment.enemy.explosionTime.time=p.bombardment.enemy.explosionTime.mTime;
                    p.bombardment.enemy.explosionTime.active=true;
                }
                if(p.bombardment.action.time == -p.bombardment.action.mTime/2){
                    p.bombardment.action.isActive = false;
                    if(!p.bombardment.bombed){
                        p.bombardment.enemy.health.cur-=p.flyDamage;
                    p.bombardment.bombed=true;
                    // bullets.push({x: p.bombardment.enemy.pos.x, y: p.bombardment.enemy.pos.y, angle: 0, time: p.bulletParams.mTime,
                    //      size: 2});
                    p.bombardment.enemy.explosionTime.time=p.bombardment.enemy.explosionTime.mTime;
                    p.bombardment.enemy.explosionTime.active=true;
                    }
                    // console.log('END')
                }
                c.drawImage(plane, 0, 0, plane.width, plane.height,
                 canvas.width/2-p.pos.x+p.bombardment.enemy.pos.x-planeSize/2, canvas.height*(p.bombardment.action.time/p.bombardment.action.mTime), planeSize, planeSize);}
        }
        // c.fillStyle='blue';
        c.fillStyle='#12b080';
        c.fillRect(0, 0, canvas.width, 30);
        c.fillStyle='#00ffb3';
        c.fillRect(0, 0, canvas.width*(p.exp/p.level.need), 30);
        c.fillStyle='white';
        // how set font family to canvas

        c.textBaseline='top';
        c.textAlign='center';
        c.font="30px Joystix";
        let game_time_str = `${Math.floor(game_time/60)}:${game_time%60<10?'0'+game_time%60:game_time%60}`;
        if(Math.floor(game_time / 60) < 10) game_time_str = `0${game_time_str}`;
        c.fillText(`${game_time_str}`, canvas.width/2, 0)
        c.fillText(`${p.level.cur + 1} LVL`, canvas.width*5/6, 0)
        if(p.deathTime.time !== 0){
            game_time_timer++;
            if(game_time_timer % 60 == 0) {
                game_time++;
                game_time_timer = 0;
            }
        } else{
            c.fillStyle = 'red';
            c.textBaseline = 'middle';
            c.font = "100px Joystix";
            c.fillText(`GAME OVER`, canvas.width/2, canvas.height/2)
        }
        
        // c.font="50px serif";
        // c.fillText(`${p.bombardment.cd.cur}`, canvas.width/4, 50);
        // c.fillText(`exp: ${p.exp}`, canvas.width/4, 50);
        // showBorders(tanks[1]);
        // showBorders(p);
        // tanks[0].angle.hull+=1;
        // c.drawImage(hull, -hull.width/2, -hull.height/2);

        // c.fillStyle='red';
        // collisionBlocks.forEach(cb=>{
        //     c.fillRect(cb.x+canvas.width/2-p.pos.x, cb.y+canvas.height/2-p.pos.y, 32*mapZoom, 32*mapZoom);
        // })
}

/**
 * 
 * @param {Tank} a 
 * @param {Array<Tank>} b 
 * @param {Array<Tank} c 
 * @returns {Array<Tank} все танки
 */

function allTanks(a, b, c){
    return [a, ...b, ...c];
}

function collisionMap(obj){
    let res = false;
    let aPoints = getBorders2(obj);
    let blocks = collisionBlocks.filter((b)=>{return Math.sqrt(Math.pow(b.x-obj.pos.x, 2)+Math.pow(b.y-obj.pos.y, 2)) < obj.drawnSize*2});
    blocks.forEach(b=>{
        c.beginPath();
        c.moveTo(b.x, b.y);
        c.lineTo(b.x+tileSize, b.y);
        c.lineTo(b.x+tileSize, b.y+tileSize);
        c.lineTo(b.x, b.y+tileSize);
        c.lineTo(b.x, b.y);
        c.closePath();
        res = res || (c.isPointInPath(aPoints[0].x, aPoints[0].y) || c.isPointInPath(aPoints[1].x, aPoints[1].y) || c.isPointInPath(aPoints[2].x, aPoints[2].y)
        || c.isPointInPath(aPoints[3].x, aPoints[3].y));
        
        c.beginPath();
        c.moveTo(aPoints[0].x, aPoints[0].y);
    c.lineTo(aPoints[1].x, aPoints[1].y);
    c.lineTo(aPoints[2].x, aPoints[2].y);
    c.lineTo(aPoints[3].x, aPoints[3].y);
    c.lineTo(aPoints[0].x, aPoints[0].y);
    c.closePath();
        res = res || (c.isPointInPath(b.x, b.y) || c.isPointInPath(b.x+tileSize, b.y) || c.isPointInPath(b.x+tileSize, b.y+tileSize) || c.isPointInPath(b.x, b.y+tileSize))
    })
    return res;
}

/**
 * соприкасается ли точка с картой
 * @param {{x:number, y:number}} obj позиция точки
 * @returns {boolean} true или false
 */

function pointCollisionMap(obj){
    let res = false;
    let blocks = bulletCollisionBlocks.filter((b)=>{return Math.sqrt(Math.pow(b.x-obj.x, 2)+Math.pow(b.y-obj.y, 2)) < p.bulletParams.size});
    blocks.forEach(b=>{
        c.beginPath();
        c.moveTo(b.x, b.y);
        c.lineTo(b.x+tileSize, b.y);
        c.lineTo(b.x+tileSize, b.y+tileSize);
        c.lineTo(b.x, b.y+tileSize);
        c.lineTo(b.x, b.y);
        c.closePath();
        res = res || c.isPointInPath(obj.x, obj.y);
    })
    return res;

}

function checkCollisionPoint(a, b){
    let bPoints = getBorders2(a);
    c.beginPath();
    c.moveTo(bPoints[0].x, bPoints[0].y);
    c.lineTo(bPoints[1].x, bPoints[1].y);
    c.lineTo(bPoints[2].x, bPoints[2].y);
    c.lineTo(bPoints[3].x, bPoints[3].y);
    c.lineTo(bPoints[0].x, bPoints[0].y);
    c.closePath();
    return c.isPointInPath(b.x, b.y);
    
}

function showCrossair(){
    let ts =[], tks = [];
    tanks.filter(t=>{return (

        Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
        +
        Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
        < Math.pow(attackRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
    let isFound = false, tk=undefined;
    
    let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
    while(!isFound && l < attackRange){
        by = -Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)*l;
        bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
        // console.log(bx, by);
        tk = tks.filter((t, i)=>{
            tk = tks[i];
            c.beginPath();
            c.moveTo(ts[i][0].x, ts[i][0].y);
            c.lineTo(ts[i][1].x, ts[i][1].y);
            c.lineTo(ts[i][2].x, ts[i][2].y);
            c.lineTo(ts[i][3].x, ts[i][3].y);
            c.lineTo(ts[i][0].x, ts[i][0].y);
            c.closePath();
            return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
        });
        isFound = tk.length>0;
        l+=0.1;
    }
    // if(isFound) console.log(`hit at ${bx} ${by}`)
    // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
    c.drawImage(crosshair,0, 0, crosshair.width, crosshair.height, bx+canvas.width/2-crossHairSize/2, by+canvas.height/2-crossHairSize/2,
    crossHairSize, crossHairSize); //+(canvas.width/2-p.pos.x)-(bx+p.pos.x), +(canvas.height/2-p.pos.y)-(by+p.pos.y)
}

function showBorders(t){
    //isPointInStroke https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke
    let x, y, x1, y1, x2, y2, x3, y3, angle, r, x4, y4,
    a = (t.hull.height - t.border.y)*t.drawnSize/t.hull.height, b = (t.hull.width-t.border.x*2)*t.drawnSize/t.hull.width;
    // r = Math.sqrt(
    //     Math.pow(b/2, 2)
    //     // +Math.pow((t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height, 2)
    // );
    r = b/2;
    x = canvas.width/2-p.pos.x+t.pos.x+r*Math.cos((180-t.angle.hull)*Math.PI/180);
    y = canvas.height/2-p.pos.y+t.pos.y-r*Math.sin((180-t.angle.hull)*Math.PI/180); //+r*Math.cos((tanks[0].angle.hull)*Math.PI/180)
    // console.log(x, y);
    angle =t.angle.hull;
    x1 = x + (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y1 = y - (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x2 = x1 + b*Math.cos(angle*Math.PI/180);
    y2 = y1 + b*Math.sin(angle*Math.PI/180);
    x3 = x2 - (a-t.border.dy*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y3 = y2 + (a-t.border.dy*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x4 = x3 - b*Math.cos(angle*Math.PI/180);
    y4 = y3 - b*Math.sin(angle*Math.PI/180);
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(x3, y3);
    c.lineTo(x4, y4);
    c.lineTo(x1, y1);
    // c.lineWidth = 5;
    c.stroke();
    // c.fillStyle='red';
    
    // c.fillRect(x-10, y-10, 20, 20);
    // c.fillRect(x1-10, y1-10, 20, 20);
    // c.fillRect(x2-10, y2-10, 20, 20);
    // c.fillRect(x3-10, y3-10, 20, 20);
    // c.fillRect(x4-10, y4-10, 20, 20);
}

function checkCollision(a, b){
    let aPoints = getBorders(a),
    bPoints = getBorders(b),
    res = false;
    c.beginPath();
    c.moveTo(bPoints[0].x, bPoints[0].y);
    c.lineTo(bPoints[1].x, bPoints[1].y);
    c.lineTo(bPoints[2].x, bPoints[2].y);
    c.lineTo(bPoints[3].x, bPoints[3].y);
    c.lineTo(bPoints[0].x, bPoints[0].y);
    c.closePath();
    // let alu=aPoints[0], ald=aPoints[1], aru=aPoints[2], ard=aPoints[3], blu=bPoints[0], bld=bPoints[1], bru=bPoints[2], brd=bPoints[3],
    // amu=aPoints[0].y, amd=aPoints[0].y, amr=aPoints[0].x, aml=aPoints[0].x, bmu=bPoints[0].y, bmd=bPoints[0].y, bmr=bPoints[0].x, bml=bPoints[0].x;
    // for(let pt of aPoints){
    //     if(pt.x <= alu.x && pt.y <= alu.y) alu=pt;
    //     if(pt.x <= ald.x && pt.y >= ald.y) ald=pt;
    //     if(pt.x >= aru.x && pt.y <= aru.y) aru=pt;
    //     if(pt.x >= ard.x && pt.y >= ard.y) ard=pt;
    //     if(pt.x > amr) amr=pt.x;
    //     if(pt.x < aml) aml = pt.x;
    //     if(pt.y < amu) amu = pt.y;
    //     if(pt.y > amd) amd=pt.y;
    // }
    // for(let pt of bPoints){
    //     if(pt.x <= blu.x && pt.y <= blu.y) blu=pt;
    //     if(pt.x <= bld.x && pt.y >= bld.y) bld=pt;
    //     if(pt.x >= bru.x && pt.y <= bru.y) bru=pt;
    //     if(pt.x >= brd.x && pt.y >= brd.y) brd=pt;
    //     if(pt.x > bmr) bmr=pt.x;
    //     if(pt.x < bml) bml = pt.x;
    //     if(pt.y < bmu) bmu = pt.y;
    //     if(pt.y > bmd) bmd=pt.y;
    // }
    // res = (aru.x >= blu.x && aru.y >= blu.y && aru.x <= bru.x && (aru.y <= bld.x || aru.y <= brd.x));
    // res = (aru.x >= bml && aru.x <= bmr && aru.y >= bmu && aru.y <= bmd);
    res = c.isPointInPath(aPoints[0].x, aPoints[0].y) || c.isPointInPath(aPoints[1].x, aPoints[1].y) || c.isPointInPath(aPoints[2].x, aPoints[2].y)
    || c.isPointInPath(aPoints[3].x, aPoints[3].y);
    // console.log(res);
    return res; 
   
}

// function checkCollision2(a, b){
//     let aPoints = getBorders2(a),
//     bPoints = getBorders2(b),
//     res = false;
//     c.beginPath();
//     c.moveTo(bPoints[0].x, bPoints[0].y);
//     c.lineTo(bPoints[1].x, bPoints[1].y);
//     c.lineTo(bPoints[2].x, bPoints[2].y);
//     c.lineTo(bPoints[3].x, bPoints[3].y);
//     c.lineTo(bPoints[0].x, bPoints[0].y);
//     c.closePath();
//     // let alu=aPoints[0], ald=aPoints[1], aru=aPoints[2], ard=aPoints[3], blu=bPoints[0], bld=bPoints[1], bru=bPoints[2], brd=bPoints[3],
//     // amu=aPoints[0].y, amd=aPoints[0].y, amr=aPoints[0].x, aml=aPoints[0].x, bmu=bPoints[0].y, bmd=bPoints[0].y, bmr=bPoints[0].x, bml=bPoints[0].x;
//     // for(let pt of aPoints){
//     //     if(pt.x <= alu.x && pt.y <= alu.y) alu=pt;
//     //     if(pt.x <= ald.x && pt.y >= ald.y) ald=pt;
//     //     if(pt.x >= aru.x && pt.y <= aru.y) aru=pt;
//     //     if(pt.x >= ard.x && pt.y >= ard.y) ard=pt;
//     //     if(pt.x > amr) amr=pt.x;
//     //     if(pt.x < aml) aml = pt.x;
//     //     if(pt.y < amu) amu = pt.y;
//     //     if(pt.y > amd) amd=pt.y;
//     // }
//     // for(let pt of bPoints){
//     //     if(pt.x <= blu.x && pt.y <= blu.y) blu=pt;
//     //     if(pt.x <= bld.x && pt.y >= bld.y) bld=pt;
//     //     if(pt.x >= bru.x && pt.y <= bru.y) bru=pt;
//     //     if(pt.x >= brd.x && pt.y >= brd.y) brd=pt;
//     //     if(pt.x > bmr) bmr=pt.x;
//     //     if(pt.x < bml) bml = pt.x;
//     //     if(pt.y < bmu) bmu = pt.y;
//     //     if(pt.y > bmd) bmd=pt.y;
//     // }
//     // res = (aru.x >= blu.x && aru.y >= blu.y && aru.x <= bru.x && (aru.y <= bld.x || aru.y <= brd.x));
//     // res = (aru.x >= bml && aru.x <= bmr && aru.y >= bmu && aru.y <= bmd);
//     res = c.isPointInPath(aPoints[0].x, aPoints[0].y) || c.isPointInPath(aPoints[1].x, aPoints[1].y) || c.isPointInPath(aPoints[2].x, aPoints[2].y)
//     || c.isPointInPath(aPoints[3].x, aPoints[3].y);
//     // console.log(res);
//     return res; 
   
// }

function getBorders(t){
    let x, y, x1, y1, x2, y2, x3, y3, angle, r, x4, y4,
    a = (t.hull.height - t.border.y)*t.drawnSize/t.hull.height, b = (t.hull.width-t.border.x*2)*t.drawnSize/t.hull.width;
    r = b/2;
    x = canvas.width/2-p.pos.x+t.pos.x+r*Math.cos((180-t.angle.hull)*Math.PI/180);
    y = canvas.height/2-p.pos.y+t.pos.y-r*Math.sin((180-t.angle.hull)*Math.PI/180);
    angle =t.angle.hull;
    x1 = x + (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y1 = y - (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x2 = x1 + b*Math.cos(angle*Math.PI/180);
    y2 = y1 + b*Math.sin(angle*Math.PI/180);
    x3 = x2 - (a-t.border.dy*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y3 = y2 + (a-t.border.dy*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x4 = x3 - b*Math.cos(angle*Math.PI/180);
    y4 = y3 - b*Math.sin(angle*Math.PI/180);
    // console.log([{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}]);
    return [{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}]
}

function getBorders2(t){
    let x, y, x1, y1, x2, y2, x3, y3, angle, r, x4, y4,
    a = (t.hull.height - t.border.y)*t.drawnSize/t.hull.height, b = (t.hull.width-t.border.x*2)*t.drawnSize/t.hull.width;
    r = b/2;
    x = canvas.width/2-p.pos.x+t.pos.x+r*Math.cos((180-t.angle.hull)*Math.PI/180);
    y = canvas.height/2-p.pos.y+t.pos.y-r*Math.sin((180-t.angle.hull)*Math.PI/180);
    angle =t.angle.hull;
    x1 = x + (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y1 = y - (a-(t.hull.height-t.realSize.hull.center.y)*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x2 = x1 + b*Math.cos(angle*Math.PI/180);
    y2 = y1 + b*Math.sin(angle*Math.PI/180);
    x3 = x2 - (a-t.border.dy*t.drawnSize/t.hull.height)*Math.sin(angle*Math.PI/180);
    y3 = y2 + (a-t.border.dy*t.drawnSize/t.hull.height)*Math.cos(angle*Math.PI/180);
    x4 = x3 - b*Math.cos(angle*Math.PI/180);
    y4 = y3 - b*Math.sin(angle*Math.PI/180);
    // console.log([{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}]);
    return [{x: x1-canvas.width/2+p.pos.x, y: y1-canvas.height/2+p.pos.y}, {x: x2-canvas.width/2+p.pos.x, y: y2-canvas.height/2+p.pos.y}, {x: x3-canvas.width/2+p.pos.x, y: y3-canvas.height/2+p.pos.y}, {x: x4-canvas.width/2+p.pos.x, y: y4-canvas.height/2+p.pos.y}]
}


var keys_pressed = [];
document.onkeydown = key_down;
document.onkeyup = key_up;
function key_down(e) {
    var evtobj = window.event ? event : e;
    keys_pressed[evtobj.keyCode] = 1;
}

function key_up(e) {
    var evtobj = window.event ? event : e;
    delete(keys_pressed[evtobj.keyCode]);
}
//https://puzzleweb.ru/javascript/char_codes-key_codes.php
//https://free-game-assets.itch.io/free-2d-tank-game-assets?download
function key_pressed(keycode) {
    if(gameState == gameStates.active){
    if(p.deathTime.time === 0) return
    let ts;
    switch(keycode){
        case CONTROLS.rotateLeft.key_code:
            if(1) //!p.teslaActive || 
            p.angle.gun-=3*(p.temp<0?(800+p.temp)/800:1);
            break
        case CONTROLS.rotateRight.key_code:
            if(1) //!p.teslaActive || 
            p.angle.gun+=3*(p.temp<0?(800+p.temp)/800:1);
            break
        case CONTROLS.left.key_code:
            if(1) //!p.teslaActive || 
            {p.angle.hull-=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            ts = tanks.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(p.drawnSize*2, 2);});
                allies.filter(t=>{return (
    
                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    +
                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    < Math.pow(p.drawnSize*2, 2);}).forEach(f=>{ts.push(f);});
            if( collisionMap(p)) 
                p.angle.hull+=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            ts.forEach(t=>{
                if(checkCollision(p, t) || checkCollision(t, p)){
                    p.angle.hull+=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            }
        })
            p.isMove=true;}
            break
        case CONTROLS.right.key_code:
            if(1) //!p.teslaActive || 
            {p.angle.hull+=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            ts = tanks.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(p.drawnSize*2, 2);});
                allies.filter(t=>{return (
    
                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    +
                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    < Math.pow(p.drawnSize*2, 2);}).forEach(f=>{ts.push(f);});
            if(collisionMap(p)){
                p.angle.hull-=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            }
            ts.forEach(t=>{
                if(checkCollision(p, t) || checkCollision(t, p)){
                    p.angle.hull-=5*(Math.min(p.speed, MAX_SPEED) / MAX_SPEED)*(p.temp<0?(800+p.temp)/800:1);
            }
        })
            p.isMove=true;}
            break
        case CONTROLS['forward'].key_code:
            p.pos.y-=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            p.pos.x+=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            ts = tanks.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(p.drawnSize*2, 2);});
                allies.filter(t=>{return (
    
                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    +
                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    < Math.pow(p.drawnSize*2, 2);}).forEach(f=>{ts.push(f);});
            // console.log(ts);
            if(collisionMap(p)){
                p.pos.y+=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            p.pos.x-=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            }
            ts.forEach(t=>{
                if(checkCollision(p, t) || checkCollision(t, p)){
                p.pos.y+=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
                p.pos.x-=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            }
            })
            p.isMove=true;
            exps.forEach((e, i)=>{
                if(checkCollisionPoint(p, e) && p.health.cur > 0){
                    if(e.type === 'health') {
                        p.health.cur = Math.min(p.health.max, p.health.cur + 60);
                        exps.splice(i, 1);
                    }
                    else{
                        p.exp++;
                        if(p.exp>=p.level.need){
                            p.level.cur++;
                            p.exp%=p.level.need;
                            p.level.need++;
                            on_level_up(p.level.cur + 1);
                            setGainState();
                        }
                        exps.splice(i, 1);
                    }
                }
            })
            break;
        case CONTROLS['backward'].key_code:
            p.pos.y+=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            p.pos.x-=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            ts = tanks.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(p.drawnSize*2, 2);});
                allies.filter(t=>{return (
    
                    Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                    +
                    Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                    < Math.pow(p.drawnSize*2, 2);}).forEach(f=>{ts.push(f);});
                if(collisionMap(p)){ 
                    p.pos.y-=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
                    p.pos.x+=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
                }
            ts.forEach(t=>{
                if(checkCollision(p, t) || checkCollision(t, p)){
                    p.pos.y-=Math.cos(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
                    p.pos.x+=Math.sin(p.angle.hull*Math.PI/180)*p.speed*p.speedFactor*(p.temp<0?(800+p.temp)/800:1);
            }
        })
                
            p.isMove=true;
            exps.forEach((e, i)=>{
                if(checkCollisionPoint(p, e) && p.health.cur > 0){
                    if(e.type === 'health') {
                        p.health.cur = Math.min(p.health.max, p.health.cur + 60);
                        exps.splice(i, 1);
                    }
                    else{
                        p.exp++;
                        if(p.exp>=p.level.need){
                            p.level.cur++;
                            p.exp%=p.level.need;
                            p.level.need++;
                            on_level_up(p.level.cur + 1);
                            setGainState();
                        }
                        exps.splice(i, 1);
                    }
                }
            })
            break;
        case CONTROLS['fire'].key_code:
            p.attackRange = attackRange;
            let tk = [], tks = [];
            // c.setTransform(1,0,0,1,0,0);
            if(p.isFreezegun){
                if(p.frCD.t == 0 && p.reload.t <= p.reload.mTime - 30) 
                {
                    freezeGunBullets.push({
                        pos: {
                            x: p.pos.x+(((tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)*p.drawnSize/p.gun.height+21)*Math.sin((p.angle.hull+p.angle.gun)*Math.PI/180)),
                            y: p.pos.y-(((tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.hull].hull.border.y)*p.drawnSize/p.gun.height+21)*Math.cos((p.angle.hull+p.angle.gun)*Math.PI/180)) //( tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)
                            //-tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height
                        },
                        angle: p.angle.hull+p.angle.gun,
                        team: teams.allies,
                        time: p.mTimeFBullets,
                        damageT: p.damageT
                    });
                    p.reload.t+= 30;
                    if(p.reload.t >= p.reload.mTime){
                        p.reload.t = p.reload.mTime;
                    }
                    p.shiftGun.state=true;
                    p.shiftGun.back = 10;
                    p.shiftGun.straight = 10;
                    p.frCD.t = p.frCD.mTime;
                }
            }
            else
            if(p.isRicochet){
                if(p.rickCD.t == 0 && p.reload.t <= p.reload.mTime - 40) 
                {
                    ricochetBullets.push({
                        pos: {
                            x: p.pos.x+(((tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)*p.drawnSize/p.gun.height+17)*Math.sin((p.angle.hull+p.angle.gun)*Math.PI/180)),
                            y: p.pos.y-(((tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.hull].hull.border.y)*p.drawnSize/p.gun.height+17)*Math.cos((p.angle.hull+p.angle.gun)*Math.PI/180)) //( tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)
                            //-tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height
                        },
                        angle: p.angle.hull+p.angle.gun,
                        team: teams.allies,
                        time: p.mTimeRBullets
                    });
                    p.reload.t+= 40;
                    if(p.reload.t >= p.reload.mTime){
                        p.reload.t = p.reload.mTime;
                    }
                    p.shiftGun.state=true;
                    p.rickCD.t = p.rickCD.mTime;
                }
            }
            else
            if(p.isMGun && !p.isTesla && !p.isFreezegun){
                
                p.MGActive = true;
                if(p.endMG==false)
                {if(p.SMGParams.t < p.SMGParams.mTime){
                    p.SMGParams.t++;
                }
                else if(p.reload.t < p.reload.mTime)
                {
                    // p.damageT = 2;
                    p.overheat=0;
                    p.MGtime++;
                    if(p.MGtime > p.reload.mTime / 0.125 * 0.7) {p.temp+=0.7; p.overheat=1;}
                for(let j = 0; j < 1; j++){
                    ts =[], tks = [];
                    tanks.filter(t=>{return (

                        Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                        +
                        Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                        < Math.pow(MGunRange*1.3, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                            < Math.pow(MGunRange*1.3, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                    let isFound = false, tk=undefined;
                    
                    let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                    while(!isFound && l < MGunRange){
                        by = -Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)*l;
                        bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
                        // console.log(bx, by);
                        tk = tks.filter((t, i)=>{
                            tk = tks[i];
                            c.beginPath();
                            c.moveTo(ts[i][0].x, ts[i][0].y);
                            c.lineTo(ts[i][1].x, ts[i][1].y);
                            c.lineTo(ts[i][2].x, ts[i][2].y);
                            c.lineTo(ts[i][3].x, ts[i][3].y);
                            c.lineTo(ts[i][0].x, ts[i][0].y);
                            c.closePath();
                            return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
                        });
                        
                        if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
                        isFound = tk.length>0;
                        l+=2;
                    }
                    // if(isFound) console.log(`hit at ${bx} ${by}`)
                    // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                    if(isFound){
                        if(tk[0].team != p.team)
                        tk[0].health.cur-=p.damageT;
                        // if(tk[0].health.cur <= 0) p.health.cur=p.health.max;
                    }
                    p.MGSize = (Math.sqrt(bx*bx+by*by) -(tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y)*p.drawnSize/p.gun.height);
                    // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
                    // p.reload.t=p.reload.mTime;
                    // p.isFlash.state=true;
                    p.shiftGun.state=true;
                    p.reload.t+=0.125;
                    if(p.reload.t == p.reload.mTime){
                        p.endMG = true;
                    }
            }}}
            }
            else
            if(p.isFiregun && p.reload.t < p.reload.mTime && !p.firegunCD && !p.isMGun && !p.isTesla && !p.isFreezegun){
                p.fireGunSize = 1;
                p.endFG.isActive=false;
                p.firegunActive = 1;
                p.attackRange = tanksSize + (p.realSize.gun.center.y-p.shiftGun.back)*p.drawnSize/p.gun.height; //+p.shiftGun.straight
                for(let j = 0; j < 1; j++){
                    let attacked = [];
                    ts =[], tks = [];
                    tanks.filter(t=>{return (

                        Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                        +
                        Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                        < Math.pow(p.attackRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        allies.filter(t=>{return (
        
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                            < Math.pow(p.attackRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                    let isFound = false, tk=undefined;
                    
                    let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                    while(!isFound && l < p.attackRange){
                        if(p.countShots == 1){
                            by = -Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)*l;
                            bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
                        }
                        else{
                        by = -Math.cos((p.angle.gun+p.angle.hull+((j-(p.countShots-1)/2)/(p.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                        bx = l*Math.sin((p.angle.gun+p.angle.hull+((j-(p.countShots-1)/2)/(p.countShots-1))*angleShiftMultishots)*Math.PI/180);
                        }   
                        // console.log(bx, by);
                        tk = tks.filter((t, i)=>{
                            tk = tks[i];
                            c.beginPath();
                            c.moveTo(ts[i][0].x, ts[i][0].y);
                            c.lineTo(ts[i][1].x, ts[i][1].y);
                            c.lineTo(ts[i][2].x, ts[i][2].y);
                            c.lineTo(ts[i][3].x, ts[i][3].y);
                            c.lineTo(ts[i][0].x, ts[i][0].y);
                            c.closePath();
                            return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
                        });
                        if(tk.length > 0)
                        {let res = false;
                        attacked.forEach(t=>{
                            res||=(t.pos.x == tk[0].pos.x && t.pos.y == tk[0].pos.y);
                        })
                        if(!res){
                            attacked.push(tk[tk.length - 1]);
                            // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
                        }}
                        if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
                        // isFound = tk.length>0;
                        l+=1;
                    }
                    // if(isFound) console.log(`hit at ${bx} ${by}`)
                    // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                    // if(isFound){
                    //     if(tk[0].team != p.team)
                    //     {tk[0].health.cur-=p.damageT;
                    //     }
                    //     if(tk[0].health.cur <= 0) p.health.cur=p.health.max;
                    // }
                    p.fireGunSize = (Math.sqrt((bx-Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180))*(bx-Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180))+(by-(-Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)))*(by-(-Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)))) -(tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y)*p.drawnSize/p.gun.height*0) / p.attackRange;
                    attacked.forEach(t=>{
                        // console.log(p.damageT)
                        if(t.team != p.team)
                        {
                            t.health.cur-=p.damageT;
                            t.temp+=6;
                            if(t.temp > 800) t.temp = 800;
                            t.attackedBF = true;
                            // if(t.health.cur <= 0) p.health.cur=p.health.max;
                        }
                        else{
                            if(t.temp < 0) {t.temp+=4;
                            if(t.temp > 0) t.temp = 0;}
                        }
                        // console.log(t)
                    });
                    // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
                    
                    // p.reload.t=p.reload.mTime;
                    // p.isFlash.state=true;
                    // p.shiftGun.state=true;
                    p.reload.t+=p.firegunSpeed;
                    if(p.reload.t >= p.reload.mTime){
                        p.fireParams.f = 0;
                        p.firegunCD = true;
                        p.firegunActive = false;
                        p.reload.t = p.reload.mTime;
                        p.endFG.isActive=true;
                        p.endFG.f=p.endFG.start;
                    }
            }
            }
            else if(p.isTesla){
                if(p.teslaActive == false && p.reload.t == 0)
                {
                    p.teslaReload=1;
                }
                
            }
            else if(!p.isFiregun && !p.isTesla && !p.isMGun && !p.isRicochet && !p.isFreezegun){
                if(p.reload.t == 0){
                    for(let j = 0; j < (p.isThunder?1:p.countShots); j++){
                        ts =[], tks = [];
                        tanks.filter(t=>{return (
    
                            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                            +
                            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                            < Math.pow(p.attackRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                            allies.filter(t=>{return (
            
                                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                                +
                                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                                < Math.pow(p.attackRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
                        let isFound = false, tk=undefined;
                        
                        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
                        while(!isFound && l < p.attackRange){
                            if(p.countShots == 1){
                                by = -Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)*l;
                                bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
                            }
                            else{
                            by = -Math.cos((p.angle.gun+p.angle.hull+((j-(p.countShots-1)/2)/(p.countShots-1))*angleShiftMultishots)*Math.PI/180)*l;
                            bx = l*Math.sin((p.angle.gun+p.angle.hull+((j-(p.countShots-1)/2)/(p.countShots-1))*angleShiftMultishots)*Math.PI/180);
                            }   
                            // console.log(bx, by);
                            tk = tks.filter((t, i)=>{
                                tk = tks[i];
                                c.beginPath();
                                c.moveTo(ts[i][0].x, ts[i][0].y);
                                c.lineTo(ts[i][1].x, ts[i][1].y);
                                c.lineTo(ts[i][2].x, ts[i][2].y);
                                c.lineTo(ts[i][3].x, ts[i][3].y);
                                c.lineTo(ts[i][0].x, ts[i][0].y);
                                c.closePath();
                                return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
                            });
                            if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
                            isFound = tk.length>0;
                            l+=0.1;
                        }
                        // if(isFound) console.log(`hit at ${bx} ${by}`)
                        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
                        if(p.isThunder){
                            tks.filter(t=>{
                                let box = getBorders2(t);
                                c.beginPath();
                                c.moveTo(box[0].x, box[0].y);
                                c.lineTo(box[1].x, box[1].y);
                                c.lineTo(box[2].x, box[2].y);
                                c.lineTo(box[3].x, box[3].y);
                                c.lineTo(box[0].x, box[0].y);
                                c.closePath();
                                return (

                                    // Math.pow(box[0].x-p.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[0].y-p.pos.y-by, 2) <= Math.pow(p.bulletParams.size*2, 2) ||
                                    // Math.pow(box[1].x-p.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[1].y-p.pos.y-by, 2) <= Math.pow(p.bulletParams.size*2, 2) ||
                                    // Math.pow(box[2].x-p.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[2].y-p.pos.y-by, 2) <= Math.pow(p.bulletParams.size*2, 2) ||
                                    // Math.pow(box[3].x-p.pos.x-bx, 2)
                                    // +
                                    // Math.pow(box[3].y-p.pos.y-by, 2) <= Math.pow(p.bulletParams.size*2, 2)
                                    c.isPointInPath(bx+p.pos.x, by+p.pos.y) ||
                                    c.isPointInPath(bx+p.pos.x + p.bulletParams.size * thunderSize / 2 , by+p.pos.y) ||
                                    c.isPointInPath(bx+p.pos.x + p.bulletParams.size * thunderSize / 2 / Math.sqrt(2), by+p.pos.y + p.bulletParams.size * thunderSize / 2 / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+p.pos.x, by+p.pos.y  + p.bulletParams.size * thunderSize / 2 ) ||
                                    c.isPointInPath(bx+p.pos.x - p.bulletParams.size * thunderSize / 2 , by+p.pos.y) ||
                                    c.isPointInPath(bx+p.pos.x - p.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+p.pos.y - p.bulletParams.size * thunderSize / 2  / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+p.pos.x, by+p.pos.y  - p.bulletParams.size * thunderSize / 2 ) ||
                                    c.isPointInPath(bx+p.pos.x - p.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+p.pos.y + p.bulletParams.size * thunderSize / 2  / Math.sqrt(2)) ||
                                    c.isPointInPath(bx+p.pos.x + p.bulletParams.size * thunderSize / 2  / Math.sqrt(2), by+p.pos.y - p.bulletParams.size * thunderSize / 2  / Math.sqrt(2))
                                    );
                            }).forEach(t=>{
                                if(t.team != p.team)
                                t.health.cur-=p.damageT;
                                // if(t.health.cur <= 0) p.health.cur=p.health.max;
                            })
                        }
                        else
                        if(isFound){
                                if(tk[0].team != p.team)
                                tk[0].health.cur-=p.damageT;
                                // if(tk[0].health.cur <= 0) p.health.cur=p.health.max;
                        } //p.bulletParams.size
                        if(p.isThunder){
                            bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, size: thunderSize});
                        }
                        else
                        {bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});}
                        
                        p.reload.t=p.reload.mTime;
                        p.isFlash.state=true;
                        p.shiftGun.state=true;
                }
            }
            }
            
            break;
    }
}
}

function teslaShot(){
    p.teslaActive = true;
    for(let j = 0; j < 1; j++){
        let attacked = [],
        ts =[], tks = [];
        tanks.filter(t=>{return (

            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
            +
            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
            < Math.pow(teslaRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
            allies.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-p.pos.x-p.realSize.hull.center.x*p.drawnSize/p.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-p.pos.y-p.realSize.hull.center.y*p.drawnSize/p.hull.width, 2) ) 
                < Math.pow(teslaRange*1.2, 2);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
        let isFound = false, tk=undefined;
        
        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
        while(l < teslaRange){
            by = -Math.cos((p.angle.gun+p.angle.hull)*Math.PI/180)*l;
            bx = l*Math.sin((p.angle.gun+p.angle.hull)*Math.PI/180);
            // console.log(bx, by);
            tk = tks.filter((t, i)=>{
                tk = tks[i];
                c.beginPath();
                c.moveTo(ts[i][0].x, ts[i][0].y);
                c.lineTo(ts[i][1].x, ts[i][1].y);
                c.lineTo(ts[i][2].x, ts[i][2].y);
                c.lineTo(ts[i][3].x, ts[i][3].y);
                c.lineTo(ts[i][0].x, ts[i][0].y);
                c.closePath();
                return c.isPointInPath(bx+p.pos.x, by+p.pos.y);
            });
            if(tk.length > 0)
            {let res = false;
            attacked.forEach(t=>{
                res||=(t.pos.x == tk[0].pos.x && t.pos.y == tk[0].pos.y);
            })
            if(!res){
                attacked.push(tk[tk.length - 1]);
                // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
            }}
            if(pointCollisionMap({x:bx+p.pos.x, y: by+p.pos.y})) break
            isFound = tk.length>0;
            l+=0.1;
        }
        // if(isFound) console.log(`hit at ${bx} ${by}`)
        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
        // if(isFound){
        //     if(tk[0].team != p.team)
        //     tk[0].health.cur-=p.damageT;
        //     if(tk[0].health.cur <= 0) p.health.cur=p.health.max;
        // }
        attacked.forEach(t=>{
            // console.log(p.damageT)
            if(t.team != p.team)
            {t.health.cur-=p.damageT;
            // if(t.health.cur <= 0) p.health.cur=p.health.max;
            }
            // console.log(t)
        });
        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
        p.teslaSize = (Math.sqrt(bx*bx+by*by) -(tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y)*p.drawnSize/p.gun.height) / p.drawnSize;
        // p.teslaSize--;
        p.reload.t=p.reload.mTime;
        // p.isFlash.state=true;
        p.shiftGun.state=true;
        
        teslasLasers.push({pos: {x: p.pos.x, y: p.pos.y},
        size: p.teslaSize*p.drawnSize, angle: p.angle.gun+p.angle.hull, timer: 0, fr: 5, f: 0, mf: 7,
         shiftY: -tanksSize-(tanksParams[p.nameImg.gun].gun.center.y - tanksParams[p.nameImg.gun].gun.border.y+p.shiftGun.back-p.shiftGun.straight)*p.drawnSize/p.gun.height - (p.teslaSize-1)*p.drawnSize
        });
        //t = {pos: {x, y}, angle, state: 0, mState: 5, fr}
        // this.teslaParams = {timer: 0, fr: 5, f: 0, mf: 7};
        // c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y);
        // c.rotate(this.angle.hull*Math.PI/180);
        // c.drawImage(p.teslaImg[this.teslaParams.f], 0, 0, p.teslaImg[this.teslaParams.f].width, p.teslaImg[this.teslaParams.f].height,  -tanksSize*0.25, -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height - (this.teslaSize-1)*this.drawnSize, this.drawnSize/2, this.teslaSize*this.drawnSize);
}
}
function teslaShotE(tank){
    tank.teslaActive = true; //было: p.teslaActive = true; если будут баги, исправить на эту
    for(let j = 0; j < 1; j++){
        let attacked = [],
        ts =[getBorders2(p)], tks = [p];
        if(p.health.cur <= 0) ts = [], tks = [];
        tanks.filter(t=>{return (

            Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
            +
            Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
            < Math.pow(teslaRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
            allies.filter(t=>{return (

                Math.pow(t.pos.x+t.realSize.hull.center.x*t.drawnSize/t.hull.width-tank.pos.x-tank.realSize.hull.center.x*tank.drawnSize/tank.hull.width, 2)
                +
                Math.pow(t.pos.y+t.realSize.hull.center.y*t.drawnSize/t.hull.width-tank.pos.y-tank.realSize.hull.center.y*tank.drawnSize/tank.hull.width, 2) ) 
                < Math.pow(teslaRange*1.2, 2) && (t.pos.x != tank.pos.x && t.pos.y != tank.pos.y);}).forEach(f=>{ts.push(getBorders2(f)); tks.push(f);});
        let isFound = false, tk=undefined;
        
        let bx=0, by=0, l=0; //bullet x, y; l - len of bullets path
        while(l < teslaRange){
            by = -Math.cos((tank.angle.gun+tank.angle.hull)*Math.PI/180)*l;
            bx = l*Math.sin((tank.angle.gun+tank.angle.hull)*Math.PI/180);
            // console.log(bx, by);
            tk = tks.filter((t, i)=>{
                tk = tks[i];
                c.beginPath();
                c.moveTo(ts[i][0].x, ts[i][0].y);
                c.lineTo(ts[i][1].x, ts[i][1].y);
                c.lineTo(ts[i][2].x, ts[i][2].y);
                c.lineTo(ts[i][3].x, ts[i][3].y);
                c.lineTo(ts[i][0].x, ts[i][0].y);
                c.closePath();
                return c.isPointInPath(bx+tank.pos.x, by+tank.pos.y);
            });
            if(tk.length > 0)
            {let res = false;
            attacked.forEach(t=>{
                res||=(t.pos.x == tk[0].pos.x && t.pos.y == tk[0].pos.y);
            })
            if(!res){
                attacked.push(tk[tk.length - 1]);
                // bullets.push({x: bx+tank.pos.x, y: by+tank.pos.y, angle: (tank.angle.gun+tank.angle.hull), time: tank.bulletParams.mTime});
            }}
            if(pointCollisionMap({x:bx+tank.pos.x, y: by+tank.pos.y})) break
            isFound = tk.length>0;
            l+=0.1;
        }
        // if(isFound) console.log(`hit at ${bx} ${by}`)
        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime, toPos:{}, flyTime: l/bulletSpeed});
        // if(isFound){
        //     if(tk[0].team != p.team)
        //     tk[0].health.cur-=p.damageT;
        //     if(tk[0].health.cur <= 0) p.health.cur=p.health.max;
        // }
        attacked.forEach(t=>{
            // console.log(p.damageT)
            if(t.team != tank.team)
            {t.health.cur-=tank.damageT;}
            // console.log(t)
        });
        // bullets.push({x: bx+p.pos.x, y: by+p.pos.y, angle: (p.angle.gun+p.angle.hull), time: p.bulletParams.mTime});
        tank.teslaSize = (Math.sqrt(bx*bx+by*by) -(tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y)*tank.drawnSize/tank.gun.height) / tank.drawnSize;
        // tank.teslaSize--;
        tank.reload.t=tank.reload.mTime;
        // tank.isFlash.state=true;
        tank.shiftGun.state=true;
        
        teslasLasers.push({pos: {x: tank.pos.x, y: tank.pos.y},
        size: tank.teslaSize*tank.drawnSize, angle: tank.angle.gun+tank.angle.hull, timer: 0, fr: 5, f: 0, mf: 7,
         shiftY: -tanksSize-(tanksParams[tank.nameImg.gun].gun.center.y - tanksParams[tank.nameImg.gun].gun.border.y+tank.shiftGun.back-tank.shiftGun.straight)*tank.drawnSize/tank.gun.height - (tank.teslaSize-1)*tank.drawnSize
        });
        //t = {pos: {x, y}, angle, state: 0, mState: 5, fr}
        // this.teslaParams = {timer: 0, fr: 5, f: 0, mf: 7};
        // c.setTransform(1, 0, 0, 1, canvas.width/2-p.pos.x+this.pos.x, canvas.height/2-p.pos.y+this.pos.y);
        // c.rotate(this.angle.hull*Math.PI/180);
        // c.drawImage(p.teslaImg[this.teslaParams.f], 0, 0, p.teslaImg[this.teslaParams.f].width, p.teslaImg[this.teslaParams.f].height,  -tanksSize*0.25, -tanksSize-(tanksParams[this.nameImg.gun].gun.center.y - tanksParams[this.nameImg.gun].gun.border.y+this.shiftGun.back-this.shiftGun.straight)*this.drawnSize/this.gun.height - (this.teslaSize-1)*this.drawnSize, this.drawnSize/2, this.teslaSize*this.drawnSize);
}
}
function pickUpRandomFromArray(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

setInterval(()=> {
    for (var keycode in keys_pressed) {
        key_pressed(keycode);
        if(gameState === gameStates.start_menu)
            handleMenuKeyPress(keycode);
    }
}, 20);
window.addEventListener('mousemove', e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
})
window.addEventListener('click', ()=>{
    mouse.click=true;
})
window.addEventListener("keyup",(e)=>{
        let key_code = String(e.keyCode);
        switch (key_code){
            
            case CONTROLS.fire.key_code:
                if(p.isFiregun && !p.firegunCD)
                {p.firegunActive = 0;
                p.fireParams.f = 0;
                p.endFG.isActive=true;
                p.endFG.f=p.endFG.start;}
                if(p.isMGun){
                    p.endMG = true;
                }
                break
}
})