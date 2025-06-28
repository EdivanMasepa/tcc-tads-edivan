import './botao.css'

export default function Button(props:any){
    return(
        <div className={`divButton ${props.className}`}>
            <button className={`button ${props.classNameButton}`} type='submit' onClick={props.onClick}>{props.legenda}</button>
        </div>
    )
}