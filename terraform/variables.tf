variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "MerchStoreRG"
}

variable "location" {
  description = "Azure region where resources will be created"
  type        = string
  default     = "swedencentral"
}

variable "environment_name" {
  description = "Name of the Container App Environment"
  type        = string
  default     = "MerchStoreEnv"
}

variable "backend_app_name" {
  description = "Name of the backend Container App"
  type        = string
  default     = "merchstorebackend"
}

variable "frontend_app_name" {
  description = "Name of the frontend Container App"
  type        = string
  default     = "merchstorefrontend"
}

variable "backend_container_image" {
  description = "Docker image for the backend container app"
  type        = string
  default     = "dennisbyberg/merch-store-backend:latest"
}

variable "frontend_container_image" {
  description = "Docker image for the frontend container app"
  type        = string
  default     = "dennisbyberg/merch-store-frontend:latest"
}

variable "container_port" {
  description = "Container port to expose"
  type        = number
  default     = 8080
}

variable "frontend_port" {
  description = "Frontend container port to expose"
  type        = number
  default     = 80
}

variable "cpu" {
  description = "CPU allocation for the container"
  type        = number
  default     = 0.25
}

variable "memory" {
  description = "Memory allocation for the container"
  type        = string
  default     = "0.5Gi"
}