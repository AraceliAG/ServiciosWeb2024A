from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Test'


if __name___ == '__main__':
    app.run()