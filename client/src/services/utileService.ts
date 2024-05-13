
import httpClient from "@/utils/httpClient"



export const requestAllCategories = async () => {
	const  response  = await httpClient.get("/store/categories");
	console.log(response)
	return response
}





