import styles from "./Demo.module.css"
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"
import axios from "axios"

const Demo = () => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const onSubmit = (data) => {
        if(data.email === ""){
            toast("Le champ doit être rempli !", {type: "error"})
            return
        }

        const obj = {
            typeMail: "demo",
            data: {
                email: data.email
            }
        }
        axios.post(`${import.meta.env.VITE_API_URL}/email/send`, obj).then(res => {
            toast("Un email a été envoyé avec succès !", {type:"success"})
            reset()
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>
            <a href="/">&#x2190; Accueil</a>
            <div>
                <img src="/me.jpg" />
                <h1>Une petite démo ? Discuttons-en !</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <input type="email" placeholder="Adresse email" {...register("email")} />
                    <input type="submit" value="Demander une démo !" />
                </form>
            </div>
        </div>
    )
}

export default Demo