import css from "./styles/Grid.module.css";

const Grid = ()=>{
    return (<div id={css.grid}>
        {[...new Array(60).fill(0)].map((value,index)=>{
            const color = parseInt(Math.random()*(5-1)+1);
            const form = parseInt(Math.random()*(6-1)+1);
            return <div key={index} className={`${css.ball} ${css[`color${color}`]} ${css[`form${form}`]}`}/>
        })}
    </div>);
}

export default Grid;
