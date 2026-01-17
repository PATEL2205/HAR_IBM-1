from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# This line tells Flask to allow requests from your React app
CORS(app) 

@app.route('/api/test')
def get_activity():
    # In the future, this will be the output of your HAR image processing model
    return jsonify({
        "activity": "WALKING",
        "status": "online"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)