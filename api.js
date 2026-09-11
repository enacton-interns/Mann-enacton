import axios from "axios";

const getJoke = async () => {
    try {
        const API_URL = process.env.API_URL
        const response = await axios.get(API_URL)
        return response.data
    } catch (err) {
        return err
    }
}

export default getJoke