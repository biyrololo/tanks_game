/**
 * @type {{[key: string]: {speed: number, max_health: number}}}
 */
const CHARACTERISTICS_HULLS = {
    '01': {
        speed: 4,
        max_health: 210
   },
    '02': {
        speed: 2,
        max_health: 330
    },
    '03': {
        speed: 6,
        max_health: 150
    },
    '04': {
        speed: 8,
        max_health: 50
    },
    '05': {
        speed: 3,
        max_health: 175
    },
    '06': {
        speed: 5,
        max_health: 130
    },
    '07': {
        speed: 6,
        max_health: 90
    },
    '08': {
        speed: 7,
        max_health: 60
    }
}

const MAX_SPEED = 8

const _FPS = 60;

/**
 * @type {{[key: string]: {damage: number, reload_time: number}}}
 */
const CHARACTERISTICS_GUNS = {
    '01': { // дефолт
        damage: 30,
        reload_time: _FPS * 1.5
    },
    '02': { // рельса
        damage: 50,
        reload_time: _FPS * 1.5
    },
    '03': { // рикошет
        damage: 25,
        reload_time: _FPS * 4
    },
    '04': { // огнемет
        damage: 1,
        reload_time: _FPS * 2
    },
    '05': { // фриз
        damage: 13,
        reload_time: _FPS * 5
    },
    '06': { // двойная
        damage: 25,
        reload_time: _FPS * 2
    },
    '07': { // гром
        damage: 40,
        reload_time: _FPS * 2.5
    },
    '08': { // пулемет
        damage: 1,
        reload_time: _FPS * 2
    }
}