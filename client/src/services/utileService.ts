
import httpClient from "@/utils/httpClient"



export const requestAllCategories = async () => {
	const  response  = await httpClient.get("/utile/categories");
	console.log(response)
	return response
}

export const requestSubCategoriesId = async (id: string) => {
	const { data: response } = await httpClient.get(
		`/utile/getSubCategories?id=${id}`
	)
	return response
}





