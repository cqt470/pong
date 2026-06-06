#include "ESP8266WiFi.h"
#include "WebSocketsClient.h"

const char* ssid = "123";
const char* password = "efg";

const char* websocket_server = "192.168.1.101";
const uint16_t websocket_port = 3040;
const char* websocket_path = "/ws";

WebSocketsClient web_socket;

// pare che ESP8266 sia una costante già esistente in qualche libreria che ho
// scaricato... devo usare un nome diverso
class Slave_ESP8266{
  private:
    void log_wifi_state(const char* prefix){
      Serial.print(prefix);
      Serial.print(" WiFi.status=");
      Serial.print(WiFi.status());
      Serial.print(" IP=");
      Serial.print(WiFi.localIP());
      Serial.print(" RSSI=");
      Serial.println(WiFi.RSSI());
    }

    // https://github.com/Links2004/arduinoWebSockets
    void event_handler(WStype_t type, uint8_t * payload, size_t length){
      Serial.print("[WSc] Event type: ");
      Serial.print((int)type);
      Serial.print(" length: ");
      Serial.println(length);

      switch(type){
        case WStype_DISCONNECTED:
          Serial.println("[WSc] Disconnesso!");
          log_wifi_state("[WSc]");
          break;
          
        case WStype_CONNECTED:
          Serial.println("[WSc] Connesso!");
          log_wifi_state("[WSc]");
          // Invia l'identificativo nel formato atteso dal server
          {
            String uuid = "esp8266-";
            uuid += String(ESP.getChipId(), HEX);

            String payload = "{\"t\":\"uuid\",\"uuid\":\"";
            payload += uuid;
            payload += "\",\"slave\":true}";

            web_socket.sendTXT(payload);
          }
          break;
          
        // apparentemente servono le {} per dichiarare
        // stringhe nei cases
        case WStype_TEXT: {
          Serial.print("[WSc] Messaggio ricevuto: ");
          Serial.println((char*)payload);
          Serial.print("[WSc] Payload length: ");
          Serial.println(length);
          break;
        }
          
        case WStype_BIN:
          Serial.print("[WSc] Dati binari ricevuti, lunghezza: ");
          Serial.println(length);
          // Invia indietro gli stessi dati binari
          web_socket.sendBIN(payload, length);
          break;
          
        case WStype_ERROR:
          Serial.print("[WSc] Errore! length=");
          Serial.println(length);
          if(payload && length > 0){
            Serial.print("[WSc] Error payload: ");
            Serial.println((char*)payload);
          }
          break;
          
        case WStype_PING:
          Serial.println("[WSc] Ping ricevuto");
          break;
          
        case WStype_PONG:
          Serial.println("[WSc] Pong ricevuto");
          break;
      }
    }
  public:
    Slave_ESP8266(){
      // codice
    }

    void setup(){
      Serial.flush();
      Serial.print("\nAvvio");
      Serial.print("\nConnessione a ");
      Serial.print(websocket_server);
      Serial.print(":");
      Serial.print(websocket_port);
      Serial.print(websocket_path);

      WiFi.begin(ssid, password);

      while(WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
      }

      Serial.print("\nConnesso, IP: ");
      Serial.println(WiFi.localIP());

      web_socket.begin(websocket_server, websocket_port, websocket_path);
      web_socket.onEvent([this](WStype_t type, uint8_t* payload, size_t length){
        this->event_handler(type, payload, length);
      });
      web_socket.setReconnectInterval(5000);
      web_socket.enableHeartbeat(15000, 3000, 2);
    }

    void run(){
      web_socket.loop();
    }
};