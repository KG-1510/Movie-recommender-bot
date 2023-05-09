from flask import Flask, render_template, request, jsonify, make_response
import requests
from model import make_recommendation

# webapp
app = Flask(__name__, template_folder='./')

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/get')
def get_from_api():
    query = request.args.get('msg')
    try:
        def get_recommendations():    
            user_text = request.args.get('msg')    
            response =  make_recommendation(str(user_text))
            return jsonify(response) 
        response_data = get_recommendations()
        return response_data
    except Exception as e:
        print(e)

if __name__ == '__main__':
    app.run(debug=True)