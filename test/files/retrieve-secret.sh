#!/usr/bin/env bash
set -x

# Retrieves the IBM Cloud API Key configured in a `deployer` cluster

export IBMCLOUD_API_KEY=$(oc get secret ibm-secret -n kube-system -o jsonpath='{.data.apiKey}' | base64 -d)
export AUTH_RESPONSE_JSON=$(curl -s -X POST \
  "https://iam.cloud.ibm.com/identity/token" \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Accept: application/json' \
  --data-urlencode 'grant_type=urn:ibm:params:oauth:grant-type:apikey' \
  --data-urlencode "apikey=${IBMCLOUD_API_KEY}")
export ACCESS_TOKEN=$(echo $AUTH_RESPONSE_JSON | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
export SECRET_JSON=$(curl -s -X GET --location --header "Authorization: Bearer ${ACCESS_TOKEN}" --header "Accept: application/json" "$(params.SECRETS_MANAGER_ENDPOINT_URL)/api/v2/secrets/$(params.KEY_ID)")
export SECRET=$(echo $SECRET_JSON |  grep -o '"payload":"[^"]*' | grep -o '[^"]*$')
printf "${SECRET}"
