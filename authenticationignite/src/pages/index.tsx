import { FormEvent, useState,useContext} from 'react';
import {AuthContext} from '../../contexts/AuthContext'


export default function Home() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')

  const {signIn}  = useContext(AuthContext)

  console.log(typeof(signIn))
  const data = {
    email,
    password
  }



  async function handleSubmit(event:FormEvent) {
    event.preventDefault();
    
    const data = {
      email,
      password,
    }

    signIn(data);
  }

  return (
    <form onSubmit = {handleSubmit} className = "form">
      <input type="email" value ={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      <button type="submit">Entrar</button>
    </form>
  )
}
