import React from 'react';
import './input.css'

interface InputProps {
    label?: string;
    placeholder?: string;
    type?:string
    value?: string;
    setValue?: (value: string) => void;
    mask?: 'telefone' | 'cpf' | 'cnpj' | 'data' | string;
    maxLength?: number
}

const mascara = (valor: string, tipo: string): string => {
    const digitos = valor.replace(/\D/g, '');

    switch (tipo){
        case 'telefone':
            if(digitos.length <= 10)
                 return digitos.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
                    [a && `(${a}`, b && `) ${b}`, c && `-${c}`].filter(Boolean).join('')
                );
            else
                return digitos.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, (_, a, b, c) =>
                    [a && `(${a}`, b && `) ${b}`, c && `-${c}`].filter(Boolean).join('')
                );
            
        case 'cpf':
            return digitos.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, (_, a, b, c, d) =>
                [a, b, c].filter(Boolean).join('.') + (d ? `-${d}` : '')
            );
        case 'cnpj':
            return digitos.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, (_, a, b, c, d, e) =>
                [a, b, c].filter(Boolean).join('.') + (d ? `/${d}` : '') + (e ? `-${e}` : '')
            );
        case 'data':
            return digitos.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, (_, d, m , y) => [d, m, y].filter(Boolean).join('/'));

        default: 
            return valor;
    }
}

export default function Input({label, placeholder, type = 'text', value, setValue, mask = 'nenhuma', maxLength }: InputProps){
    const aplicarMascara = (evento: React.ChangeEvent<HTMLInputElement>) => {
        const mascaraValor = mascara(evento.target.value, mask);
        setValue?.(mascaraValor)
    }
    return(
        <div className='divPrincipalInput'>

            <div className='divLabel'>
                <label className='label'>{label}</label>
            </div>

            <div className='divInput'>

                <input 
                    className='input'
                    placeholder={placeholder}
                    type={type}
                    value={value}              
                    onChange={aplicarMascara} 
                    maxLength={maxLength} 
                />  
                          
            </div>
        </div>
    )
}