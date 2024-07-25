import { cookies } from 'next/headers';
import Dashboard from './dashboard.js';


export default function Page(){
    return <Dashboard 
      cookies={cookies()}/>
}