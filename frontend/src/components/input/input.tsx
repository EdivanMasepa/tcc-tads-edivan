import './input.css'

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    setValue: (value: string) => void
}

export default function Input({ ...props }: InputProps){
    return(
        <div className='divPrincipalInput'>
            <div className='divLabel'>
                <label className='label'>{props.label}</label>
            </div>
            <div className='divInput'>
                <input className='input' onChange={(e) => props.setValue(e.target.value)} type='text' placeholder={props.placeholder} value={props.value}></input>            
            </div>
        </div>
    )
}