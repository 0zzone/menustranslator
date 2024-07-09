import styles from "./Admin.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect, useState } from "react"
import Skeleton from '@mui/material/Skeleton';
import clsx from "clsx"

const Admin = () => {

    const {
        register,
        handleSubmit,
    } = useForm()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [change, setChange] = useState(false)

    const onSubmit = (data) => {
        const {name} = data
        setLoading(true)
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/users/search`, {name}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            setData(res.data.data)
            setLoading(false)
        }).catch(e => {
            window.location.href = "/"
            toast(e.response.data.error, {type: "error"})
        })
    }

    useEffect(() => {
        setLoading(true)
        const session = JSON.parse(localStorage.getItem("session"))
        if(!session || !session.token) {
            window.location.href = "/"
            return
        }
        axios.post(`${import.meta.env.VITE_API_URL}/users/search`, {name: ""}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            setData(res.data.data)
            setLoading(false)
        }).catch(e => {
            if(e.response.status === 403){
                window.location.href = "/etablissements"
            } else{
                toast(e.response.data.error, {type: "error"})
                localStorage.removeItem("session")
            }
        })
    }, [change])

    const changeSubscription = (id_user, new_price_id, previous_price_id) => {
        if(new_price_id !== previous_price_id) {
            const session = JSON.parse(localStorage.getItem("session"))
            axios.post(`${import.meta.env.VITE_API_URL}/stripe/update/${new_price_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }).then(res => {
                setChange(!change)
            }).catch(e => {
                toast(e.response.data.error, {type: "error"})
            }) 
        }
    }

    return(
        <div className={styles.container}>
            <h1>Panel admin 🚀</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <input type="text" placeholder="Nom ou Prénom de l'utilisateur" {...register("name")} />
                <input type="submit" value="Rechercher" />
            </form>

            {!loading ? <div className={styles.dataContainer}>
                <div className={styles.top}>
                    <p>{data.length === 0 ? "Aucun résultat" : data.length === 1 ? "1 résultat" : `${data.length} résultats`}</p>
                </div>
                <div className={styles.data}>
                    {data && data.length > 0 && data.map((user, index) => (
                        <div key={index} className={clsx(user.role === "ADMIN" && styles.adminLine)}>
                            <div>
                                <h2>{user.firstName} {user.lastName}</h2>
                                <p>{user.email}</p>
                                <p className={styles.join}><span>Restaurants:</span> {user.etablissements.map(etablissement => etablissement.name).join(", ")}</p>
                            </div>
                            <div className={styles.right}>
                                <div>
                                    <p>Silver</p>
                                    <div
                                        className={clsx(styles.sub, user.subscription === import.meta.env.VITE_SILVER_PRICE && styles.selected)}
                                        // onClick={() => changeSubscription(user.id_user, import.meta.env.VITE_SILVER_PRICE, user.subscription)}
                                    ></div>
                                </div>
                                <div>
                                    <p>Gold</p>
                                    <div
                                        className={clsx(styles.sub, user.subscription === import.meta.env.VITE_GOLD_PRICE && styles.selected)}
                                        // onClick={() => changeSubscription(user.id_user, import.meta.env.VITE_GOLD_PRICE, user.subscription)}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> : <div className={styles.skeletons}>
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
                <Skeleton variant="rectangular" height={50} className={styles.skeleton} />
            </div>}

        </div>
    )
}

export default Admin