import styles from "./Login.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import {toast} from "react-toastify"
import bcrypt from "bcryptjs-react"

const Login = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        const {email, password} = data
        axios.get(`${import.meta.env.VITE_API_URL}/users/get/${email}`).then(res => {
            const user = res.data.data
            if(bcrypt.compareSync(password, user.password)){
                localStorage.setItem("session", JSON.stringify(user))
                window.location.href = "/etablissements"
            } else {
                toast("Email ou mot de passe incorrect", {type: "error"})
            }
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>
            <div>
                <h1>Se connecter</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="email" {...register("email")} placeholder="Adresse e-mail ..." />
                    <input type="password" {...register("password")} placeholder="Mot de passe ..." />
                    <input type="submit" value="Se connecter" />
                </form>
                <a href="/register">Pas encore inscrit ?</a>
            </div>
        </div>
    )
}

export default Login