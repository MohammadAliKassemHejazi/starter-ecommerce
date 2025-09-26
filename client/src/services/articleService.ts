
import httpClient from "@/utils/httpClient"
import { 
	ArticleResponse, 
	ArticlesListResponse, 
	CreateArticleResponse, 
	UpdateArticleResponse, 
	DeleteArticleResponse 
} from "@/interfaces/api/article.types";

export interface IArticleProps {
	id?: string;
	title: string;
	text: string;
}

export const requestArticleById = async (id: string): Promise<ArticleResponse> => {
	const { data: response } = await httpClient.get<ArticleResponse>(
		`/articles/get?id=${id}`
	)
	return response
}

export const requestAllArticles = async (): Promise<ArticlesListResponse> => {
	const { data: response } = await httpClient.get<ArticlesListResponse>("/articles");
	return response
}

export const requestArticleByAuthor = async (): Promise<ArticlesListResponse> => {
	const { data: response } = await httpClient.get<ArticlesListResponse>("/articles/get/author");
	return response;
}

export const requestCreateArticles = async (article: IArticleProps): Promise<CreateArticleResponse> => {
	const { data: response } = await httpClient.post<CreateArticleResponse>("/articles/create", article)
	return response
}

export const requestUpdateArticles = async (article: IArticleProps): Promise<UpdateArticleResponse> => {
	const { data: response } = await httpClient.patch<UpdateArticleResponse>("/articles/update/" + article.id, article)
	return response
}

export const requestDeleteArticles = async (id: string): Promise<DeleteArticleResponse> => {
	const { data: response } = await httpClient.delete<DeleteArticleResponse>("/articles/delete/" + id)
	return response
}



