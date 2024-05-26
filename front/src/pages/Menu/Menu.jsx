import styles from "./Menu.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const Menu = () => {

    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
            setLoading(true)
            axios.get(`${import.meta.env.VITE_API_URL}/etablissements/${id}`).then(res => {
                setData(res.data.data)
                setLoading(false)
            })
        })()
    }, [])

    return(
        <>
            {!loading ? <div className={styles.container}>
                <h1>{data.name}</h1>
                {data.sections.map((section, index) => (
                    <div key={index}>
                        <h2 style={{color: "#628f50"}}>{section.name} {section.price && `- ${section.price}€`}</h2>
                        {section.lines.map((line, index2) => (
                            <> 
                                {index2 > 0 && <div className={styles.ball}></div>}
                                <p key={`${index}_${index2}`}>{line.name} {line.price && `- ${line.price}€`}</p>
                            </>
                        ))}
                    </div>
                ))}
            </div> : <p>Loading</p>}
        </>
    )
}

export default Menu