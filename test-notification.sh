#!/bin/bash

# Notification Test Script
# Bu script bir operasyon oluşturur, başlatır ve notification testi yapar

API_BASE="http://localhost:3001/api"
USERNAME="admin"
PASSWORD="password"

echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:20}..."

# Operasyon için start_time'ı 15 dakika önceye ayarla (notification hemen gelsin)
START_TIME=$(date -u -v-15M +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -d "15 minutes ago" +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%S.000Z")
DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

echo ""
echo "📋 Creating operation..."
echo "Start time: $START_TIME (15 minutes ago for immediate notification)"

OPERATION_RESPONSE=$(curl -s -X POST "$API_BASE/operations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"code\": \"TEST-NOTIF-$(date +%s)\",
    \"tour_name\": \"Notification Test Operation\",
    \"status\": \"planned\",
    \"date\": \"$DATE\",
    \"start_time\": \"$START_TIME\",
    \"vehicle_id\": \"35-VIP-01\",
    \"driver_id\": \"DRV-Test\",
    \"guide_id\": \"GID-Test\",
    \"total_pax\": 10,
    \"checked_in_count\": 5,
    \"route\": [
      {\"lat\": 38.4255, \"lng\": 27.136},
      {\"lat\": 38.424, \"lng\": 27.1345}
    ]
  }")

OPERATION_ID=$(echo $OPERATION_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$OPERATION_ID" ]; then
  echo "❌ Operation creation failed!"
  echo "Response: $OPERATION_RESPONSE"
  exit 1
fi

echo "✅ Operation created: $OPERATION_ID"
echo "   Code: $(echo $OPERATION_RESPONSE | grep -o '"code":"[^"]*' | cut -d'"' -f4)"
echo "   Total PAX: 10"
echo "   Checked in: 5 (50% - below 70% threshold)"

echo ""
echo "🚀 Starting operation..."

START_RESPONSE=$(curl -s -X POST "$API_BASE/operations/$OPERATION_ID/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

if echo "$START_RESPONSE" | grep -q '"status":"active"'; then
  echo "✅ Operation started successfully"
else
  echo "❌ Operation start failed!"
  echo "Response: $START_RESPONSE"
  exit 1
fi

echo ""
echo "⏳ Waiting for notification check..."
echo "   (OperationsMonitorService runs every minute)"
echo "   Since start_time is 15 minutes ago, notification should trigger on next cron run"
echo ""
echo "📊 Operation Details:"
echo "   Operation ID: $OPERATION_ID"
echo "   Check-in ratio: 5/10 = 50% (< 70% threshold)"
echo "   Start time: $START_TIME (15 minutes ago)"
echo ""
echo "🔔 Expected notification:"
echo "   Type: WARNING"
echo "   Message: 'Operation Notification Test Operation: Low check-in rate (50%)'"
echo ""
echo "💡 To check notifications:"
echo "   GET $API_BASE/notifications"
echo ""
echo "✅ Test setup complete!"

