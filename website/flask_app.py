from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = os.path.join("website", "static")

@app.route("/")
def main():
    return render_template("main.html")

@app.route("/uploads", methods=["POST"])
def upload():
    image = request.files["my_image"]
    imageSplit = image.filename.split(".")
    cb_type = request.form["colorblindnessType"]
    image.save(os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(f"{imageSplit[0]}_{cb_type}.{imageSplit[1]}")))

app.run(debug=True)