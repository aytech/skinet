export interface IEnvironment {
  production: boolean,
  apiUrl?: string
}

export const environment = {
  production: false,
  apiUrl: "https://localhost:7125/api"
}