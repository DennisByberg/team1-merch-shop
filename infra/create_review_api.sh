#!/bin/bash

# Variables
RESOURCE_GROUP="MerchStoreRG"
LOCATION="swedencentral"
STORAGE_ACCOUNT_NAME="merchstorageno1"
FUNCTION_APP_NAME="ReviewApiFunc20250507"
RUNTIME="dotnet-isolated"
API_KEY="API_KEY"

# Create Function App and link to Storage Account
echo "Creating Function App: $FUNCTION_APP_NAME..."
az functionapp create --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --consumption-plan-location $LOCATION --runtime $RUNTIME \
    --functions-version 4 \
    --storage-account $STORAGE_ACCOUNT_NAME

# Enable CORS for Function App
echo "Enabling CORS for Function App..."
az functionapp cors add --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --allowed-origins "*"

# Create function API key
echo "Setting up API key..."
az functionapp keys set --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --key-name reviewApiKey \
    --key-type functionKeys \
    --key-value $API_KEY

# Wait until the Function App is running
function wait_until_functionapp_is_running {
    STATUS=$(az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query "state" --output tsv)

    while [[ "$STATUS" != "Running" ]]; do
        echo "Waiting for Function App: $FUNCTION_APP_NAME to be ready (Current status: $STATUS)..."
        sleep 10 # Wait for 10 seconds before checking again
        STATUS=$(az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query "state" --output tsv)
    done

    echo "Function App: $FUNCTION_APP_NAME is now running!"
}

wait_until_functionapp_is_running

echo "Environment setup complete! Make note of these values for later use:"
echo "Function App Name: $FUNCTION_APP_NAME"
echo "API Key: $API_KEY"
