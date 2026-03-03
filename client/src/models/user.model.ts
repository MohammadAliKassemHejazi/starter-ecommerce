export interface UserModel {
	id: string
	email: string
	name: string
	address?: string
	phone?: string
	accessToken?: string
	bio?: string
	isActive?: boolean
	createdAt?: string
	updatedAt?: string
	createdById?: string
	roles?: any[]
	subscription?: any
}
