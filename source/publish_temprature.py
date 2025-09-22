import time
import ssl
import paho.mqtt.client as mqtt
import os
from dotenv import load_dotenv
load_dotenv()
TOPIC = "temperature"
SENSOR_PATH = "/sys/bus/w1/devices/28-0000092c511b/w1_slave"
connected_flag = False
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
USERNAME=os.getenv("USERNAME")
PASSWORD=os.getenv("PASSWORD")
def read_temperature():
    try:
        with open(SENSOR_PATH, 'r') as f:
            lines = f.readlines()
            if len(lines) < 2:
                print("Failed to read temperature: incomplete sensor data")
                return -1.0
            temp_line = lines[1]
            temp_pos = temp_line.find('t=')
            if temp_pos == -1:
                print("Failed to find temperature in sensor data")
                return -1.0
            temp_str = temp_line[temp_pos+2:].strip()
            temp_c = int(temp_str) / 1000.0
            return temp_c
    except Exception as e:
        print(f"Exception reading temperature: {e}")
        return -1.0

def on_connect(client, userdata, flags, rc):
    global connected_flag
    if rc == 0:
        print("Connected successfully!")
        connected_flag = True
    else:
        print(f"Connection failed with code {rc}")

def on_log(client, userdata, level, buf):
    print(f"LOG: {buf}")

def main():
    global connected_flag

    client = mqtt.Client(client_id="test-client", clean_session=True)
    client.username_pw_set(USERNAME, PASSWORD)


    client.tls_set(cert_reqs=ssl.CERT_REQUIRED)
    client.tls_insecure_set(False)  

    client.on_connect = on_connect
    client.on_log = on_log

    print("Connecting to HiveMQ Cloud...")
    client.connect(HOST, PORT, keepalive=60)

    client.loop_start()

    wait_seconds = 0
    while not connected_flag and wait_seconds < 10:
        time.sleep(1)
        wait_seconds += 1

    if not connected_flag:
        print("Failed to connect within timeout.")
        client.loop_stop()
        return

    try:
        for _ in range(10):
            temp = read_temperature()
            if temp < 0:
                print("Skipping invalid temperature reading")
            else:
                payload = f"{temp:.2f}"
                result = client.publish(TOPIC, payload, qos=0)
                status = result[0]
                if status == 0:
                    print(f"Published temperature: {payload}°C")
                else:
                    print(f"Failed to publish message: {status}")
            time.sleep(6)
    except KeyboardInterrupt:
        print("Disconnected using keyboard")
        client.disconnect()
        client.loop_stop()


    client.disconnect()
    client.loop_stop()

if __name__ == "__main__":
    main()