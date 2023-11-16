const env = process.env.REACT_APP_ENVIRONMENT
const productionBaseUrl = process.env.REACT_APP_PRODUCTION_BASE_URL
const developmentBaseUrl = process.env.REACT_APP_DEVELOPMENT_BASE_URL

export const baseUrl = env == "development" ? developmentBaseUrl : env == "production" ? productionBaseUrl : "xyz";