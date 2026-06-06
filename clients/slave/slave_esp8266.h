#include "ESP8266WiFi.h"
#include "WebSocketsClient.h"

const char* ssid = "xyz";
const char* password = "xyz";

const char* websocket_server = "192.168.1.101";
const uint16_t websocket_port = 3004;
const char* websocket_path = "/ws";

WebSocketsClient web_socket;

// pare che ESP8266 sia una costante già esistente in qualche libreria che ho
// scaricato... devo usare un nome diverso
class Slave_ESP8266{
  private:
    // https://github.com/Links2004/arduinoWebSockets
    void event_handler(WStype_t type, uint8_t * payload, size_t length){
      switch(type){
        case WStype_DISCONNECTED:
          Serial.println("[WSc] Disconnesso!");
          break;
          
        case WStype_CONNECTED: {
          Serial.println("[WSc] Connesso!");
          // Invia un messaggio di benvenuto
          web_socket.sendTXT("Ciao server!");
          break;
          
        // apparentemente servono le {} per dichiarare
        // stringhe nei cases
        case WStype_TEXT:
          Serial.print("[WSc] Messaggio ricevuto: ");
          Serial.println((char*)payload);
          
          // Rispondi al messaggio
          String risposta = "Ricevuto: ";
          risposta += (char*)payload;
          web_socket.sendTXT(risposta);
          break;
        }
          
        case WStype_BIN:
          Serial.print("[WSc] Dati binari ricevuti, lunghezza: ");
          Serial.println(length);
          // Invia indietro gli stessi dati binari
          web_socket.sendBIN(payload, length);
          break;
          
        case WStype_ERROR:
          Serial.println("[WSc] Errore!");
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

      WiFi.begin(ssid, password);

      while(WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
      }

      Serial.print("\nConnesso, IP: ");
      Serial.println(WiFi.localIP());
    }

    void run(){
      Serial.println("Ciao");
    }
};