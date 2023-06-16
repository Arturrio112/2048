enum Direction {
    Up,
    Down,
    Left,
    Right
}
class Game{
    grid: number[][];
    GRID_ROWS:number = 4;
    GRID_COL:number = 4;
    constructor(){
        this.grid = Array.from({ length: this.GRID_ROWS }, () =>
            Array.from({ length: this.GRID_COL }, () =>
                Math.random() > 0.85 ? 2 : 0
        )
        );
    }
    moveElementsRight(array: number[]): number[] {
        const zeroes = array.filter((x) => x === 0);
        const nonZeroes = array.filter((x) => x !== 0);
        return zeroes.concat(nonZeroes);
    }
    getNthColumn(n: number): number[] {
        return this.grid.map((row) => row[n]);
    }
    mergeRow(array: number[]): number[] {
        const arr: number[] = [];
        
        for(let i=array.length-1;i>=0;i--){
            if(array[i]==array[i-1]){
                arr.push(array[i]*2)
                arr.push(0)
                i--
            }else{
                arr.push(array[i])
            }
        }
        return arr.reverse()
    }
    randoma(array: number[][]): number[][]{
        return array.map((row)=>{
            return this.makeNextMove(row)
        })
    }
    randomaL(array: number[][]): number[][]{
        return array.map((row)=>{
            return this.makeNextMove(row.reverse())
        })
    }
    makeNextMove(array: number[]): number[]{
        let arr: number[] = [...array]
        arr = this.moveElementsRight(arr)
        arr = this.mergeRow(arr)
        arr = this.moveElementsRight(arr)
        return arr
    }
    reverse(array: number[][]): number[][]{
        return [...array].reverse()
    }
    transpose(array: number[][]): number[][]{
        return array[0].map((_,i)=>array.map(r=>r[i]))
    }
    rotateClock(array: number[][]): number[][]{
        return this.transpose(this.reverse(array))
    }
    rotateCounter(array: number[][]): number[][]{
        return this.reverse(this.transpose(array))
    }
    makeNextBoard(dir: Direction): void{
        switch(dir){
            case Direction.Down:
                this.grid = this.rotateClock(this.randoma(this.rotateCounter(this.grid)))
                break
            case Direction.Up:
                this.grid = this.rotateCounter(this.randoma(this.rotateClock(this.grid)))
                break
            case Direction.Left:
                this.grid = this.randomaL(this.grid).map((row)=>{
                    return row.reverse()
                })
                break
            case Direction.Right:
                this.grid = this.randoma(this.grid)
                break
        }
    }
    addNewElements(): void{
        let freeOpt: number[][]= this.getEmptyCells()
        let number = freeOpt.length>0?Math.floor(Math.random()*(freeOpt.length-1)):-1
        if(number>=0){
            let choice = freeOpt[number]
            let newNumber = Math.random() > 0.9 ? 4 : 2
            this.grid[choice[0]][choice[1]]=newNumber
        }
    }
    isGridFull(): boolean{
        return this.grid.flat().every((curr)=>curr!=0)
    }
    isGameover(): boolean{
        if(this.isGridFull()){
            for(let i=0; i<this.GRID_ROWS; i++){
                for(let j=0; j< this.GRID_COL; j++){
                    if(this.hasEqualNeighboar(i, j)){
                        return false;
                    }
                }
            }
            return true
        }
        return false;
    }
    private hasEqualNeighboar(i: number, j:number):boolean{
        const neighCord: number[][] = [[0,1],[1,0],[0,-1],[-1,0]]
        const currCellVal = this.grid[i][j]
        for (const [x,y] of neighCord) {
            if(this.grid?.[i+x]?.[j+y]!=undefined&&currCellVal==this.grid[x+i][y+j]){
                return true
            }
        }
        return false
    }
    private getEmptyCells():number[][]{
        let freeOpt: number[][]=[]
        for(let i=0;i<this.GRID_ROWS;i++){
            for(let j=0;j<this.GRID_COL;j++){
                if(this.grid[i][j]==0){
                    freeOpt.push([i,j])
                }
            }
        }
        return freeOpt
    }

}   
const game = new Game

const nextMove = (e:KeyboardEvent): void=>{
    
    switch(e.code){
        case "ArrowUp":
            game.makeNextBoard(Direction.Up)
            break
        case "ArrowDown":
            game.makeNextBoard(Direction.Down)
            break
        case "ArrowLeft":
            game.makeNextBoard(Direction.Left)
            break
        case "ArrowRight":
            game.makeNextBoard(Direction.Right)
            break
        default:
            throw new Error("gejs")
    }
    renderBoard()
    
}
const renderBoard = (): void=>{
    game.addNewElements()
    const div = document.querySelector(".game-grid") as HTMLDivElement
    div.innerHTML = ""
    for(let i=0; i<4; i++){
        for(let j=0; j<4;j++){
            let child = document.createElement("div");
            if(game.grid[i][j]>0){
                child.innerText = String(game.grid[i][j]) 
                child.classList.add("color");
                switch(game.grid[i][j]){
                    case 4:
                        child.classList.add("c4");
                        break;
                    case 8:
                        child.classList.add("c8");
                        break;
                    case 16:
                        child.classList.add("c16");
                        break;
                    case 32:
                        child.classList.add("c32");
                        break;
                    case 64:
                        child.classList.add("c64");
                        break;
                    case 128:
                        child.classList.add("c128");
                        break;
                    case 256:
                        child.classList.add("c256");
                        break;
                    case 512:
                        child.classList.add("c512");
                        break;
                    case 1024:
                        child.classList.add("c1024");
                        break;
                    case 2048:
                        child.classList.add("c2048");
                        break;
                    default:
                        child.classList.add("c0");
                        break;
                }
            }else{
                child.classList.add("start");
            }
            div.appendChild(child);
        }
    }
    if(game.isGameover()){
        console.log("Game Over")
    }
}

renderBoard()
window.addEventListener("keydown", (e)=>{nextMove(e)})
