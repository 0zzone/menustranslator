import styles from "./Success.module.css"
import {useParams} from "react-router-dom"
import { useEffect } from "react";
import axios from "axios"

const Success = () => {

    if(window.innerWidth < 1024) window.location.href = "/mobile"

    const {price_id} = useParams();

    useEffect(() => {
        (async () => {
            const session = JSON.parse(localStorage.getItem("session"))
            await axios.post(`${import.meta.env.VITE_API_URL}/stripe/update/${price_id}`, {}, {
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