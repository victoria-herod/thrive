#!/usr/bin/env bash

echo "Creating appcenter-config.json file"
cat > ./android/app/src/main/assets/appcenter-config.json <<EOL
{
  "app_secret": "${APPCENTER_APP_SECRET}"
}
EOL