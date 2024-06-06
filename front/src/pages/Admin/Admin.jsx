import styles from "./Admin.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect, useState } from "react"
import Skeleton from '@mui/material/Skeleton';

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
        axios.post(`${import.meta.env.VITE_API_URL}/etablissements/search`, {name}).then(res => {
            setData(res.data.data)
            setLoading(false)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    useEffect(() => {
        setLoading(true)
        axios.post(`${import.meta.env.VITE_API_URL}/etablissements/search`, {name: ""}).then(res => {
            setData(res.data.data)
            setLoading(false)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }, [change])

    const changeSubscription = (id_user, new_price_id, previous_price_id) => {
        if(new_price_id !== previous_price_id) {
            axios.post(`${import.meta.env.VITE_API_URL}/stripe/update/${id_user}/${new_price_id}`).then(res => {
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
                <input type="text" placeholder="Nom du restaurant ..." {...register("name")} />
                <input type="submit" value="Rechercher" />
            </form>

            {!loading ? <div className={styles.dataContainer}>
                <p>{data.length === 0 ? "Aucun résultat" : data.length === 1 ? "1 résultat" : `${data.length} résultats`}</p>
                <div className={styles.data}>
                    {data.map((resto, index) => (
                        <div key={index}>
                            <div>
                                <h2>{resto.name}</h2>
                                <p>by {resto.owner.firstName} {resto.owner.lastName} {`(${resto.owner.email})`}</p>
                            </div>
                            <div className={styles.right}>
                                <div>
                                    <p>Silver</p>
                                    <div
                                        style={resto.owner.subscription === import.meta.env.VITE_SILVER_PRICE ? {backgroundColor: "#333"} : undefined}
                                        onClick={() => changeSubscription(resto.owner.id_user, import.meta.env.VITE_SILVER_PRICE, resto.owner.subscription)}
                                    >
                                    </div>
                                </div>
                                <div>
                                    <p>Gold</p>
                                    <div
                                        style={resto.owner.subscription === import.meta.env.VITE_GOLD_PRICE ? {backgroundColor: "#333"} : undefined}
                                        onClick={() => changeSubscription(resto.owner.id_user, import.meta.env.VITE_GOLD_PRICE, resto.owner.subscription)}
                                    >
                                    </div>
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