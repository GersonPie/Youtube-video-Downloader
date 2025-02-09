from flask import Flask, send_from_directory

app = Flask(__name__)

# Directory where the final video is stored
DOWNLOAD_FOLDER = "./"
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory('./', filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Run the server