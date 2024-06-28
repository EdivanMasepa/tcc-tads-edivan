import './input.css'

export default function Input(props:any){
    return(
        <div className='divPrincipalInput'>
            <div className='divLabel'>
                <label className='label'>{props.label}</label>
            </div>
            <div className='divInput'>
                <input className='input' type='text' placeholder={props.placeholder}></input>            
            </div>
        </div>
    )
}