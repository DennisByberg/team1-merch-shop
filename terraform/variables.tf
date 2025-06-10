variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  sensitive   = true
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "MerchStoreRG"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Sweden Central"
}

variable "container_app_environment_name" {
  description = "Name of the Container App Environment"
  type        = string
  default     = "MerchStoreEnv"
}

variable "backend_app_name" {
  description = "Name of the backend Container App"
  type        = string
  default     = "merchstorebackend"
}

variable "backend_image" {
  description = "Docker image for backend container"
  type        = string
  sensitive   = true
}

variable "frontend_app_name" {
  description = "Name of the frontend Container App"
  type        = string
  default     = "merchstorefrontend"
}

variable "frontend_image" {
  description = "Docker image for frontend container"
  type        = string
  sensitive   = true
}

variable "api_env_name" {
  description = "Environment variable name for API URL"
  type        = string
  default     = "VITE_API_URL"
}

variable "api_url" {
  description = "Backend API URL for frontend"
  type        = string
  sensitive   = true
}

variable "key_vault_name" {
  description = "Name of the key vault"
  type        = string
  default     = "merchstorekeyvault"
}

variable "azurerm_storage_account_name" {
  description = "Name of the storage account"
  type        = string
  default     = "merchstorageno1"
}