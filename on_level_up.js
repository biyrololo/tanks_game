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
    }
    if(new_level === 6){
        aviableGuns.push('05')
        aviableGuns.push('02')

        aviableTanks.push('08')
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