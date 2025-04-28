terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

# Configure the Azure Provider
provider "azurerm" {
  features {}
}

# Create a Resource Group
# resource "azurerm_resource_group" "rg" {
#   name     = var.resource_group_name
#   location = var.location
# }

# Lägg till detta istället:
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Create a Container App Environment
resource "azurerm_container_app_environment" "env" {
  name                = var.environment_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
}

resource "azurerm_container_app" "backend" {
  name                         = var.backend_app_name
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = var.backend_app_name
      image  = var.backend_container_image
      cpu    = var.cpu
      memory = var.memory
    }
  }

  ingress {
    external_enabled = true
    target_port      = var.container_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

resource "azurerm_container_app" "frontend" {
  name                         = var.frontend_app_name
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = var.frontend_app_name
      image  = var.frontend_container_image
      cpu    = var.cpu
      memory = var.memory
    }
  }

  ingress {
    external_enabled = true
    target_port      = var.frontend_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}