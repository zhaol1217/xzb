declare global {
    interface FoodMenu{
        kind:string
        foodList:FoodDetail[]
    }
    interface FoodDetail{
        name:string
    }
}
export {}
