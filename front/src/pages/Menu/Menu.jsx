import styles from "./Menu.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Lang from "./Lang";

const Menu = () => {

    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [lang, setLang] = useState('FR')

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
                {data.logo ? <img src={data.logo} alt="Logo" /> : <h1>{data.name}</h1>}

                <Lang lang={lang} setLang={setLang} />

                {data.sections.map((section, index) => (
                    <div key={index}>
                        <h2 style={{color: data ? data.theme : "#628f50"}}>{section.name} {section.price && `- ${section.price}€`}</h2>
                        {section.lines.map((line, index2) => (
                            <> 
                                {index2 > 0 && <div className={styles.ball}></div>}
                                <p key={`${index}_${index2}`}>{line.name} {line.price && `- ${line.price}€`}</p>
                            </>
                        ))}
                    </div>
                ))}
                <p className={styles.credits}>Made by Mattéo Bonnet</p>
            </div> : <div className={styles.loading}>
                <p>Chargement ...</p>
                <Box sx={{ display: 'flex', justifyContent: "center", width: "100%", marginTop:"50px"}}>
                    <CircularProgress color="grey" />
                </Box>
            </div>}


        </>
    )
}

export default Menu