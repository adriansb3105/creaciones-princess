/*import { useEffect, useState } from "react"

export const useFetch = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        
        fetch('')
        
        .then((response) => console.log(response))
        .then((data) => {
            console.log(data);
            return setData(data)
        })
        .finally(() => setLoading(false))
    }, [])

    return { data, loading }
}
*/