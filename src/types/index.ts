export interface Foods {
  id: number
  title: string
  description: string
  price: number
  oldprice: number
  url: string
}

export interface LoginForm {
  url: string
  title: string
  description: string
  oldPrice: number
  price: number
}

export const initialState: LoginForm = {
  url: '',
  title: '',
  description: '',
  oldPrice: 0,
  price: 0
}
