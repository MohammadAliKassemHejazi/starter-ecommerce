
import httpClient from "@/utils/httpClient"



export const requestAllCategories = async () => {
	const  response  = await httpClient.get("/utile/categories");
	console.log(response)
	return response
}





