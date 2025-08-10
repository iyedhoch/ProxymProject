import React,{useState} from "react";
import styles from "./Test.module.css";

function Test(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    
    const handleSubmit=e=>{
        e.preventDefault();
        if (!email||!password) {
            setError("please make sure to fill all the fields");
            return;
        }
    }



    return(
        <div className={styles.container}>
            <form onSubmit={handleSubmit} >
                <h2>Login</h2>

                {error&&<p className={styles.error}>{error}</p>}
                
                <input type="email" placeholder="Email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}   
                />

                <input
                 type="password" placeholder="Passwor" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)} 
                />

                <button type="submit">Login</button>
                <button type="button">Register</button>
            </form>
        </div>
    );
}
export default Test