import './button.css'

export default function Button(props:any){
    return(
        <div className='divButton'>
            <button className='button' type='submit' onClick={props.onClick}>{props.legenda}</button>
        </div>
    )
}