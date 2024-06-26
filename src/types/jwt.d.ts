export interface UserJwtPayload {
  id: number
  username: string
  exp: number
}

export interface UserJwtVariables {
  jwtPayload: UserJwtPayload
  [key: string]: any // Hono's requirements
}
