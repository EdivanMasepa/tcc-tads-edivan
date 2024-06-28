import './button.css'

export default function Button(props:any){
    return(
        <div className='divButton'>
            <button className='button' type='submit'>{props.legenda}</button>
        </div>
    )
}