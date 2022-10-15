// import { read } from "../../utils/FS.js"
import { read } from "../../utils/FS.js"
import mainKeyboards from "./main.keyboards.js"

const foodsMenu = (foodName) => {

    const foundFoods = read('types.json').filter(e => e.kitchName == foodName)
    let foods = []

    for (let i = 0; i < foundFoods.length; i+=2) {
        let arr = []

        if (foundFoods[i]) {
            arr.push(foundFoods[i].name, foundFoods[i + 1].name )
        }
        foods.push(arr.filter(e => e))
    }

    foods.push([mainKeyboards.main_menu])

    return foods
}

export default {
    menu: [
        [mainKeyboards.national, mainKeyboards.eropean],
        [mainKeyboards.fast, mainKeyboards.sea]
    ], 
    foodsMenu

}