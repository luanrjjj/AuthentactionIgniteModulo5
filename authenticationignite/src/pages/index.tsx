import { GetServerSideProps } from 'next';
import { FormEvent, useState,useContext} from 'react';
import {AuthContext} from '../../contexts/AuthContext'
import {parseCookies} from 'nookies';


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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx)

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination:'/dashboard',
        permanent:false,
      }
    }
  }
  return {
    props: {}
  }
}
