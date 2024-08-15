# server.py

from flask import Flask, request, jsonify
from pypresence import Presence, exceptions as pypresence_exceptions
from flask_cors import CORS
import time
import json

app = Flask(__name__)
CORS(app)

RPC_CLIENT_ID = "1223323453969403976"
RPC = Presence(RPC_CLIENT_ID)
RPC.connect()

def update_rpc(details, state, limage, startTime, buttons, ltext, simage, stext):
    try:
        print(RPC.update(
            details=details[:128] if details else "none",
            state = state[:128] if state else "none",
            large_image=limage[:128] if limage else "none",
            small_image=simage[:128] if simage else "none",
            start=int(startTime),
            buttons=json.loads(buttons) if buttons else [{"label": "none", "url": "http://none.none"}],
            large_text=ltext[:128] if ltext else "none",
            small_text=stext[:128] if stext else "none"
        ))
    except pypresence_exceptions.PipeClosed:
        print("PipeClosed exception occurred. Reconnecting...")
        RPC.connect()
        time.sleep(1)
        update_rpc(details, state, limage, startTime, buttons, ltext ,simage, stext)

@app.route('/update_rpc', methods=['POST'])
def handle_update_rpc():
    data = request.get_json()
    details = data.get('details', '')
    state = data.get('state', '')
    limage = data.get('limage', '')
    startTime = data.get('startTime', '')
    buttons = data.get('buttons', '')
    ltext = data.get('ltext', '')
    simage = data.get('simage','')
    stext = data.get('stext','')
    if not details:
        return jsonify({'success': False})
    print("Received POST request with details:", details)
    print("Received POST request with state:", state)
    print("Received POST request with limage:", limage)
    print("Received POST request with startTime:", startTime)
    print("Received POST request with buttons:", buttons)
    print("Received POST request with ltext:", ltext)
    print("Received POST request with simage:", simage)
    print("Received POST request with stext:", stext)

    update_rpc(details, state, limage, startTime, buttons, ltext ,simage, stext)

    return jsonify({'success': True})

@app.route('/clear_rpc', methods=['POST'])
def handle_clear_rpc():
    print(RPC.clear())
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=False)
