import styles from "./Admin.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect, useState } from "react"
import Skeleton from '@mui/material/Skeleton';
import clsx from "clsx"
import { MdHome } from "react-icons/md";

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
            console.log(res.data.data)
            setData(res.data.data)
            setLoading(false)
        }).catch(e => {
            if(e.response.status === 403){
                // window.location.href = "/etablissements"
            } else{
                toast(e.response.data.error, {type: "error"})
                localStorage.removeItem("session")
            }
        })
    }, [change])

    const changeSubscription = (id_user, role) => {
       
        const session = JSON.parse(localStorage.getItem("session"))
        axios.put(`${import.meta.env.VITE_API_URL}/users/update-role`, {id_user, role}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            setChange(!change)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })

    }

    return(
        <div className={styles.container}>
            <h1><MdHome className={styles.home} onClick={() => window.location.href = "/etablissements"} /> Panel admin 🚀</h1>
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
                                <h2>{user.firstName} {user.lastName} {!user.subcription && user.role === "USER" && <span>Aucun abonnement</span>}</h2>
                                <p>{user.email}</p>
                                <p className={styles.join}><span>Restaurants:</span> {user.etablissements.length > 0 ? user.etablissements.map(etablissement => etablissement.name).join(", ") : 'Aucun restaurant'}</p>
                            </div>
                            <div className={styles.right}>
                                <div>
                                    <p>USER</p>
                                    <div
                                        className={clsx(styles.sub, user.role === "USER" && styles.selected)}
                                        onClick={() => changeSubscription(user.id_user, "USER")}
                                    ></div>
                                </div>
                                <div>
                                    <p>FREE</p>
                                    <div
                                        className={clsx(styles.sub, user.role === "FREE" && styles.selected)}
                                        onClick={() => changeSubscription(user.id_user, "FREE")}
                                    ></div>
                                </div>
                                <div>
                                    <p>ADMIN</p>
                                    <div
                                        className={clsx(styles.sub, user.role === "ADMIN" && styles.selected)}
                                        onClick={() => changeSubscription(user.id_user, "ADMIN")}
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