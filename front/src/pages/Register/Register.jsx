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
    } = useForm()

    const onSubmit = async (data) => {

        if(data.password != data.confirmPassword) {
            toast("Mots de passe différents !", {type: "error"})
            return
        }

        if(data.password.length < 8){
            toast("Votre mot de passe doit faire au moins 8 caractères", {type: "error"})
            return;
        }

        try {
            const obj = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: bcrypt.hashSync(data.password, salt),
            }
            axios.post(`${import.meta.env.VITE_API_URL}/users/create`, obj).then(res => {
                localStorage.setItem("session", JSON.stringify({token: res.data.token}))
                axios.post(`${import.meta.env.VITE_API_URL}/email/send`, {
                    typeMail: "welcome",
                    to: obj.email
                }).then(res2 => {
                    
                }).catch(e => {
                    console.log(e)
                })
                window.location.href = "/etablissements"
            }).catch(e => {
                toast(e.response.data.error, {type: "error"})
            })
          } catch (error) {
            console.error('Error:', error);
          }

    }



    return(
        <div className={styles.container}>
            <a href="/">&#x2190; Accueil</a>
            <div>
                <h1>Inscription</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("firstName")} placeholder="Prénom ..." required />
                    <input type="text" {...register("lastName")} placeholder="Nom ..." required />
                    <input type="email" {...register("email")} placeholder="Adresse e-mail ..." required />
                    <input type="password" {...register("password")} placeholder="Mot de passe ..." required />
                    <input type="password" {...register("confirmPassword")} placeholder="Confirmer le mot de passe ..." required />
                    <input type="submit" value="S'inscrire" />
                </form>
                <a href="/login">{"J'"}ai déjà un compte ?</a>
            </div>
        </div>
    )
}

export default Register