export interface AdminStore {
  username: string
  password: string
  couldRegister: boolean
  jwtMainSecretKey: string
  jwtAdminSecretKey: string
}
