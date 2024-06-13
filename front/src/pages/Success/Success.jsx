import styles from "./Success.module.css"
import {useParams} from "react-router-dom"
import { useEffect } from "react";
import axios from "axios"

const Success = () => {

    const {price_id, id_user} = useParams();

    useEffect(() => {
        (async () => {
            const session = JSON.parse(localStorage.getItem("session"))
            await axios.post(`${import.meta.env.VITE_API_URL}/users/update/${id_user}/${price_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            })
        })()
    })

    return(
        <div>
            <div className={styles.container}>
                <img src="/payment.jpg" alt="Payment successful"/>
                <h1>Merci pour votre commande !</h1>
                <a href="/etablissements">Accéder à mon dashboard &#x2192;</a>
            </div>
        </div>
    )
}

export default Success