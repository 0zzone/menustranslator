import styles from "../Login/Login.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-toastify"
import bcrypt from "bcryptjs-react";
var salt = bcrypt.genSaltSync(10);

const Register = () => {

    if(localStorage.getItem("session")) window.location.href = "/etablissements"

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {

        if(data.password != data.confirmPassword) {
            toast("Mots de passe différents !", {type: "error"})
            return
        }

        const obj = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: bcrypt.hashSync(data.password, salt)
        }
        axios.post(`${import.meta.env.VITE_API_URL}/users/create`, obj).then(res => {
            localStorage.setItem("session", JSON.stringify(res.data))
            window.location.href = "/etablissements"
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>
            <div>
                <h1>Inscription</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("firstName")} placeholder="Prénom ..." />
                    <input type="text" {...register("lastName")} placeholder="Nom ..." />
                    <input type="email" {...register("email")} placeholder="Adresse e-mail ..." />
                    <input type="password" {...register("password")} placeholder="Mot de passe ..." />
                    <input type="password" {...register("confirmPassword")} placeholder="Confirmer le mot de passe ..." />
                    <input type="submit" value="S'inscrire" />
                </form>
                <a href="/login">{"J'"}ai déjà un compte ?</a>
            </div>
        </div>
    )
}

export default Register