import styles from "./ForgotPassword.module.css"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import axios from "axios"

const ForgotPassword = () => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const onSubmit = (data) => {
        if(data.email.length === 0){
            toast("Le champ doit être rempli !", {type:"error"})
            return
        }

        axios.post(`${import.meta.env.VITE_API_URL}/email/send`, {
            typeMail: "resetPassword",
            data: {
                email: data.email
            }
        }).then(res => {
            toast("Un email vous a été envoyé !", {type: "success"})
            reset()
        }).catch(e => {
            toast("Une erreur est survenue", {type: "error"})
        })

    }

    return(
        <div className={styles.container}>
            <a href="/">&#x2190; Accueil</a>
            <div>
                <h1>Récupération du mot de passe</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="email" {...register("email")} placeholder="Adresse e-mail" />
                    <input type="submit" value="Recevoir un lien" />
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword