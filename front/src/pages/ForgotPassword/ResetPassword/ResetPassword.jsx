import { toast } from "react-toastify"
import styles from "../ForgotPassword.module.css"
import { useForm } from "react-hook-form"
import bcrypt from "bcryptjs-react";
var salt = bcrypt.genSaltSync(10);
import axios from "axios"
import { useParams } from "react-router-dom";

const ResetPassword = () => {

    const {id_user, token=null} = useParams()

    const {
        register,
        handleSubmit,
    } = useForm()

    const onSubmit = (data) => {
        if(data.new_passord.length === 0 || data.confirmation_new_password.length === 0) {
            toast("Tous les champs doivent être remplis !", {type:"error"})
            return
        }

        if(data.new_passord.length < 8 || data.confirmation_new_password.length < 8) {
            toast("Le mot de passe doit faire au moins 8 caractères !", {type:"error"})
            return
        }

        if(data.new_passord !== data.confirmation_new_password) {
            toast("Les deux mots de passe ne sont pas les mêmes !", {type: "error"})
            return
        }

        axios.post(`${import.meta.env.VITE_API_URL}/users/update`, {
            user: {
                password: bcrypt.hashSync(data.new_passord, salt),
                id_user,
            },
            token
        }).then(res => {
            toast("Mot de passe modifié !", {type: "success", duration: 2000, onClose: () => window.location.href = "/login"})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })

    }

    return(
        <div className={styles.container}>
            <a href="/">&#x2190; Accueil</a>
            <div>
                <h1>Changement de votre mot de passe</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="password" placeholder="Nouveau mot de passe" {...register("new_passord")} />
                    <input type="password" placeholder="Confirmation du nouveau mot de passe" {...register("confirmation_new_password")} />
                    <input type="submit" value="Enregistrer" />
                </form>
            </div>
        </div>
    )
}

export default ResetPassword