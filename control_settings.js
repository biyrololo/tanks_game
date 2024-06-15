class ControlBtn{
    constructor(pos, size, text, color,font, title, id, onclick){
        this.state = 1;
        this.pos=pos;
        this.size=size;
        this.text=text;
        this.title = title;
        this.color=color;
        this.onclick=onclick;
        this.id=id;
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
    draw(c, is_active){
        this.shift=0;
        this.drawn.color=this.color.bg;
        this.hoverParams.lastState=this.hoverParams.state;
        if(this.isHover()) this.hover();
        else {if(this.hoverParams.lastState===1 || this.hoverParams.value > 0) this.hoverParams.back=true;
            this.hoverParams.state=0;}
        if(this.hoverParams.back) this.endHover();
        c.fillStyle=this.drawn.color;
        if(is_active) {
            c.fillStyle = this.color.hover;
        }
        c.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height*0.8+this.shift);
        // c.fillStyle=this.color.bottom;
        c.fillRect(this.pos.x,this.pos.y+this.size.height*0.8+this.shift,this.size.width,this.size.height*0.2-this.shift);
        c.fillStyle=this.color.text;
        c.font=`${this.font.size}px ${this.font.name}`;
        c.textAlign='center';
        c.textBaseline = 'bottom';
        c.fillText(this.title, this.pos.x+this.size.width/2, this.pos.y-10);
        c.textBaseline='middle';
        c.fillText(this.text,this.pos.x+this.size.width/2,this.pos.y+this.size.height/2);
    }
}

const allContols = Object.keys(CONTROLS);

var active_control_ = null;

const controlBtns = allContols.map((key, index) => {
    return new ControlBtn(
        {x: 10 + index * 110, y: 600},
        {width: 100, height: 50},
        CONTROLS[key].key_name,
        {
            bg: 'black',
            text: 'white',
            bottom: 'black',
            hover: 'gray',
            img: 'white'
        },
        {
            name: 'Joystix',
            size: 20
        },
        CONTROLS[key].title,
        key,
        () => {
            active_control_ = key;
        }
    )
})

function handleMenuKeyPress(key_code){
    if(active_control_ === null) return;
    let key_name = getKeyName(key_code);
    for(let btn of controlBtns){
        if(btn.id === active_control_){
            btn.text = key_name;
            localStorage.setItem(active_control_, key_code);
            CONTROLS[active_control_].key_name = key_name;
            CONTROLS[active_control_].key_code = key_code;
            active_control_ = null;
            break;
        }
    }
}

function renderControls(c){
    controlBtns.forEach((btn) => {
        btn.draw(c, active_control_=== btn.id);
    })
}