import styles from "./Etablissements.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"
import Skeleton from '@mui/material/Skeleton';


const Etablissements = () => {

    if(!localStorage.getItem("session")) window.location.href = "/"
    const [user, setUser] = useState(null)
    const [change, setChange] = useState(false)
    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        (async () => {
            const user = JSON.parse(localStorage.getItem("session"))
            setLoading(true)
            const userDB = await axios.get(`${import.meta.env.VITE_API_URL}/users/get/${user.email}`)
            setUser(userDB.data.data)
            setLoading(false)
        })()
    }, [change])

    const onSubmit = (data) => {
        const obj = {
            name: data.name,
            owner_id: user.id_user
        }
        axios.post(`${import.meta.env.VITE_API_URL}/etablissements/create`, obj).then(res => {
            toast("Restaurant ajouté !", {type: "success"})
            setChange(!change)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>

            {user ? <h1>Bonjour, {user.firstName} 👋</h1> : <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("name")} placeholder="Nom du restaurant ..." />
                <input type="submit" value="Ajouter" /> 
            </form>

            <h2>Mes restaurants</h2>
            <div className={styles.liste}>
                {user && user.etablissements && user.etablissements.length > 0 ? user.etablissements.map((etablissement, index) => (
                    <a href={`/admin/etablissement/${etablissement.id_etablissement}`} key={index} className={styles.card}>
                        <h2>{etablissement.name}</h2>
                    </a>
                )) : loading ? <div className={styles.liste}>
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                </div> : <p className={styles.aucun}>Aucun restaurant</p>}
            </div>
        </div>
    )
}

export default Etablissements