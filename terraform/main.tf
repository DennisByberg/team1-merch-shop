# Terraform configuration
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.32.0"
    }
  }
}

data "azurerm_client_config" "current" {}

# Provider configuration
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}


# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# Container App Environment
resource "azurerm_container_app_environment" "main" {
  name                = var.container_app_environment_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# Container App - Backend
resource "azurerm_container_app" "backend" {
  name                         = var.backend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  max_inactive_revisions       = 1

  identity {
    type = "SystemAssigned"
  }

  template {
    container {
      name   = var.backend_app_name
      image  = var.backend_image
      cpu    = 0.25
      memory = "0.5Gi"
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8080
    transport                  = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

# Container App - Frontend
resource "azurerm_container_app" "frontend" {
  name                         = var.frontend_app_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  max_inactive_revisions       = 1

  template {
    container {
      name   = var.frontend_app_name
      image  = var.frontend_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = var.api_env_name
        value = var.api_url
      }
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8080
    transport                  = "auto"
    client_certificate_mode    = "ignore"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                = var.key_vault_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  enable_rbac_authorization  = true
  soft_delete_retention_days = 90
  purge_protection_enabled   = false
}

# Storage Account
resource "azurerm_storage_account" "main" {
  name                     = var.azurerm_storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  access_tier              = "Cold"

  min_tls_version = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 1
    }

    container_delete_retention_policy {
      days = 1
    }
  }
}