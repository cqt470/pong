#ifndef ESP32_MASTER_H
#define ESP32_MASTER_H

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Configurazione WiFi
const char* ssid = "wdqdqd";
const char* password = "qdqwd";

// Configurazione WebSocket
const char* websocket_server = "192.168.1.101";
const uint16_t websocket_port = 3040;
const char* websocket_path = "/ws";

// Configurazione OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
#define OLED_RESET   -1
#define SCREEN_ADDRESS 0x3C
#define I2C_SDA 21
#define I2C_SCL 22

// Parametri grafici
#define BAR_OFFSET  8
#define BAR_WIDTH   2
#define BAR_HEIGHT  4
#define BALL_SIZE   2

// Variabili globali
WebSocketsClient webSocket;
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
bool connected = false;

struct GameState {
  int l;
  int r;
  struct { int x; int y; } b;
} state = { -1, -1, { -1, -1 } };

String uuid;

// Dichiarazione anticipata di renderGame (serve perché usata prima della definizione)
void renderGame();

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Disconnesso");
      connected = false;
      break;

    case WStype_CONNECTED: {
      // Blocco con {} per evitare errore "jump to case label"
      Serial.println("[WS] Connesso");
      connected = true;
      uuid = "esp32-" + String(ESP.getEfuseMac(), HEX);
      String msg = "{\"t\":\"uuid\",\"uuid\":\"" + uuid + "\",\"slave\":false}";
      webSocket.sendTXT(msg);
      break;
    }

    case WStype_TEXT: {
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);
      if (error) return;
      const char* typeMsg = doc["t"];
      if (typeMsg && strcmp(typeMsg, "update") == 0) {
        if (doc.containsKey("l")) state.l = doc["l"];
        if (doc.containsKey("r")) state.r = doc["r"];
        if (doc.containsKey("b")) {
          state.b.x = doc["b"]["x"];
          state.b.y = doc["b"]["y"];
        }
        renderGame();
      }
      break;
    }

    case WStype_BIN:
    case WStype_ERROR:
    case WStype_PING:
    case WStype_PONG:
      break;
  }
}

void renderGame() {
  display.clearDisplay();
  
  if (state.l >= 0 && state.l <= SCREEN_HEIGHT - BAR_HEIGHT) {
    display.fillRect(BAR_OFFSET, state.l, BAR_WIDTH, BAR_HEIGHT, SSD1306_WHITE);
  }
  if (state.r >= 0 && state.r <= SCREEN_HEIGHT - BAR_HEIGHT) {
    display.fillRect(SCREEN_WIDTH - BAR_OFFSET - BAR_WIDTH, state.r, BAR_WIDTH, BAR_HEIGHT, SSD1306_WHITE);
  }
  if (state.b.x >= 0 && state.b.x <= SCREEN_WIDTH - BALL_SIZE &&
      state.b.y >= 0 && state.b.y <= SCREEN_HEIGHT - BALL_SIZE) {
    display.fillRect(state.b.x, state.b.y, BALL_SIZE, BALL_SIZE, SSD1306_WHITE);
  }
  
  display.display();
}

class ESP32_Master {
public:
  void setup() {
    Serial.begin(115200);
    Wire.begin(I2C_SDA, I2C_SCL);
    
    if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
      Serial.println(F("OLED non trovato!"));
      while(1) delay(1000);
    }
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0,0);
    display.println("Connecting WiFi...");
    display.display();
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\nWiFi connesso, IP: " + WiFi.localIP().toString());
    display.clearDisplay();
    display.println("WiFi OK");
    display.println("Connecting WS...");
    display.display();
    
    webSocket.begin(websocket_server, websocket_port, websocket_path);
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
  }
  
  void run() {
    webSocket.loop();
  }
};

#endif