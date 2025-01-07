class MenuButton{
    /**
     * 
     * @param {{x: number, y: number}} pos 
     * @param {{width: number, height: number}} size 
     * @param {function} onclick 
     * @param {string} image 
     * @param {boolean} transparent
     */
    constructor(pos, size, onclick, image, transparent = false){
        this.transparent = transparent;
        this.state = 1;
        this.pos=pos;
        this.size=size;
        this.onclick=onclick;
        this.shift=0;
        this.hoverParams={value: 0, max: 5, state: 0, lastState: 0, back: false};
        this.image = new Image();
        this.image.src = image;
    }
    isHover(){
        return (mouse.x>this.pos.x && mouse.x<this.pos.x+this.size.width && mouse.y>this.pos.y && mouse.y  < this.pos.y+this.size.height);
    }
    hover(){
        // if(this.hoverParams.back) this.hoverParams.back=false;
        document.body.style.cursor='pointer';
        // if(this.hoverParams.state===0) {
        //     if(this.hoverParams.value<this.hoverParams.max)
        //     this.hoverParams.value++;
        // }
        // this.shift=this.size.height*0.1*this.hoverParams.value/this.hoverParams.max;
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
    draw(is_active){
        this.shift=0;
        this.hoverParams.lastState=this.hoverParams.state;
        if(this.isHover()) this.hover();
        else {
            if(this.hoverParams.lastState===1 || this.hoverParams.value > 0) this.hoverParams.back=true;
            this.hoverParams.state=0;
            document.body.style.cursor='default';
        }
        if(this.hoverParams.back) this.endHover();
        c.fillStyle='#33561C';
        if(is_active){
            c.fillStyle='#6A9E4A';
        }
        if(!this.transparent){
            c.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height);
            // c.fillStyle='white';
            // c.fillRect(this.pos.x,this.pos.y+this.size.height*0.8+this.shift,this.size.width,this.size.height*0.2-this.shift);
        }
        // let padding_x = (this.size.width - 150) / 2;
        let padding_x = 0;
        c.drawImage(this.image, this.pos.x + padding_x, this.pos.y, this.size.height, this.size.height);
    }
}

class MenuColorButton{
    /**
     * 
     * @param {{x: number, y: number}} pos 
     * @param {{width: number, height: number}} size 
     * @param {function} onclick 
     * @param {string} image 
     */
    constructor(pos, size, onclick, color){
        this.state = 1;
        this.pos=pos;
        this.size=size;
        this.onclick=onclick;
        this.shift=0;
        this.hoverParams={value: 0, max: 5, state: 0, lastState: 0, back: false};
        this.color = color;
    }
    isHover(){
        return (mouse.x>this.pos.x && mouse.x<this.pos.x+this.size.width && mouse.y>this.pos.y && mouse.y  < this.pos.y+this.size.height);
    }
    hover(){
        if(this.hoverParams.back) this.hoverParams.back=false;
        document.body.style.cursor='pointer';
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
    draw(is_active){
        this.shift=0;
        this.hoverParams.lastState=this.hoverParams.state;
        if(this.isHover()) this.hover();
        else {
            if(this.hoverParams.lastState===1 || this.hoverParams.value > 0) this.hoverParams.back=true;
            this.hoverParams.state=0;
            document.body.style.cursor='default';
        }
        if(this.hoverParams.back) this.endHover();
        c.fillStyle=this.color;
        c.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height*0.8+this.shift);
        // c.fillStyle='white';
        c.fillRect(this.pos.x,this.pos.y+this.size.height*0.8+this.shift,this.size.width,this.size.height*0.2-this.shift);
    }
}

