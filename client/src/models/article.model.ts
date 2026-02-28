export interface IArticleModel {
  id: string
  title: string
  text: string
  createdAt: string
  updatedAt: string
  userId: string
}


export interface IArticleModelWithUser {
  id: string
  title: string
  text: string
  createdAt: string
  updatedAt: string
  user: IArticleAuthor | undefined
}

export interface IArticleAuthor {
  id: string
  name: string 

}
