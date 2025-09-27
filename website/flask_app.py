from flask import Flask, render_template, request, url_for
from werkzeug.utils import secure_filename
import daltonize
import os
from PIL import Image

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = os.path.join("website", "static")

@app.route("/")
def main():
    return render_template("main.html")

@app.route("/uploads", methods=["POST"])
def upload():
    image = request.files["my_image"]
    cb_type = request.form["colorblindnessType"]

    imageSplit = image.filename.split(".")
    newFile = secure_filename(f"{imageSplit[0]}_{cb_type}.{imageSplit[1]}")

    img = Image.open(image).convert("RGB")
    img_arr = daltonize._img_to_array(img)

    dalton_fig = daltonize.daltonize(img_arr, cb_type.lower())

    img = daltonize._array_to_img(dalton_fig)
    img.save(f"website/static/{newFile}")

    return url_for("static", filename=newFile)

app.run(debug=True)
