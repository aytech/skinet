export interface IEnvironment {
  production: boolean,
  apiUrl: string
}

export const environment: IEnvironment = {
  production: true,
  apiUrl: "api"
}