function on_level_up(new_level){
    if(new_level === 3){
        aviableGuns.push('06')

        aviableTanks.push('03')

    }
    if(new_level === 5){
        aviableGuns.push('05')

        aviableTanks.push('05')

        avliableHullColors.push('C')
        avliableHullColors.push('D')
        pumpings.push(
            new Pumping('лазер', {x: 2, y: 1}, ()=>{
                pumpings.push(new Pumping('урон лазера + 10%\nзамедление скорости + 10%', {x: 2, y: 1},()=>{
                    p.laserDamage*=1.1;
                    p.laserSpeedFactor-=0.1;
                    p.laserImgCount.max++;
                    playerStatesList[playerStates.laser].cur++;
                    p.laserWidth*=1.1;
                    if(playerStatesList[playerStates.laser].cur == 3){
                        pumpings.push(new Pumping('урон лазера +10%\nобласть поражения + 20%', {x: 2, y: 1}, ()=>{
                            p.laserRange*=1.2;
                            p.laserDamage*=1.1;
                            p.laserWidth*=1.2;
                            playerStatesList[playerStates.laser].cur++;
                            pumpings.push(new Pumping('замедление скорости лазера + 20%', {x: 2, y: 1}, ()=>{
                                playerStatesList[playerStates.laser].cur++;
                                p.laserSpeedFactor-=0.2;
                                p.laserImgCount.max=9;
                                p.laserWidth*=1.2;
                                pumpings.push(new Pumping('урон лазера +50%', {x: 2, y: 1},()=>{
                                    playerStatesList[playerStates.laser].cur++;
                                p.laserDamage*=1.5;
                                p.laserImgCount.max=12;
                                p.laserWidth=30;
                                }) )
                            }))
                        }))
                    }
                },3));
                p.isLaserActive=1;
                p.laserImgCount.max = 3;
                playerStatesList[playerStates.laser].active=true;
            }),
        )
    }
    if(new_level === 6){
        aviableGuns.push('05')
        aviableGuns.push('02')

        aviableTanks.push('08')

        pumpings.push(
            new Pumping('Черный луч', {x: 3, y: 0}, ()=>{
                p.isRay = 1;
                p.rayCount = 1;
                playerStatesList[playerStates.ray].active=true;
                pumpings.push(new Pumping('Уменьшить кд на 10%', {x: 3, y: 0}, ()=>{
                    playerStatesList[playerStates.ray].cur++;
                    p.rayCd.max*=0.9;
                    p.rayCd.cur = 0;
                    pumpings.push(new Pumping('Увеличить количество лучей', {x: 3, y: 0}, ()=>{
                        playerStatesList[playerStates.ray].cur++;
                        p.rayCount=2;
                        p.rayCd.cur = 0;

                        pumpings.push(
                            new Pumping('Увеличить урон', {x: 3, y: 0}, ()=>{
                                playerStatesList[playerStates.ray].cur++;
                                p.rayDamage += 30;
                            }, 2)
                        )
            
                    }))
                }))
            })
        )
    }
    if(new_level === 9){
        aviableGuns.push('08')

        aviableTanks.push('01')
        aviableTanks.push('02')
    }
    if(new_level === 11){
        aviableGuns.push('03')
    }
}