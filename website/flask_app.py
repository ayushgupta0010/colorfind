from flask import Flask, render_template, request, url_for
from werkzeug.utils import secure_filename
from daltonize import daltonize
import os
import numpy as np
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
    img_arr = np.asarray(img, dtype=np.float16)
    img_arr = daltonize.gamma_correction(img_arr)

    dalton_fig = daltonize.daltonize(img_arr, color_deficit=cb_type[0].lower())
    
    img = daltonize.array_to_img(dalton_fig)
    img.save(f"website/static/{newFile}")
    
    return url_for("static", filename=newFile)

app.run(debug=True)
