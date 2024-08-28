import styles from "./Success.module.css"
import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios"
import {toast} from "react-toastify"

const Success = () => {

    if(window.innerWidth < 1024) window.location.href = "/mobile"

    const {price_id} = useParams();
    const [button, setButton] = useState(false)


    useEffect(() => {
        (async () => {
            const session = JSON.parse(localStorage.getItem("session"))
            axios.post(`${import.meta.env.VITE_API_URL}/stripe/update/${price_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }).then(res => {
                setButton(true)
            }).catch(e => {
                toast(e.response.data.message, {type: "error"})
            })
        })()
    })

    return(
        <div>
            <div className={styles.container}>
                <img src="/payment.jpg" alt="Payment successful"/>
                <h1>Merci pour votre commande !</h1>
                {button ? <a href="/etablissements">Accéder à mon dashboard &#x2192;</a> : <p>Veuillez patienter ...</p>}
            </div>
        </div>
    )
}

export default Success