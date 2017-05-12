from flask import Flask, render_template, request, session, url_for, redirect
from utils import template
import hashlib, json

app = Flask(__name__)
app.secret_key = "secrets"

# Site Navigation

# NOTE: ALL ROUTES NEED TO END WITH / (ex. /login/ instead of /login)
@app.route("/")
def root():
    if isLoggedIn():
        return render_template("index.html")
    else:
        return render_template("index.html")

@app.route("/login/", methods=["POST"])
def login():
    # request
    username = request.form["username"]
    password = request.form["password"]
    #auth
    if userDb.isValidAccountInfo(username,password):
        session['userID'] = userDb.getUserID(username)
    return redirect(url_for('root'))

@app.route("/logout/")
def logout():
    session.pop('userID')
    return redirect(url_for('root'))

@app.route("/register/", methods=["POST"])
def register():
    # request
    username = request.form["username"]
    password = request.form["password"]
    #reg
    if not userDb.doesUserExist("username"):
        userDb.registerAccountInfo(username,password)
        session['userID'] = userDb.getUserID(username)
    return redirect(url_for('root'))



# HELPERS-----------------------------------------------------------------------

# Login Helpers
def isLoggedIn():
    return "uID" in session

def getUserID():
    return session["uID"]

def hash(unhashed):
    return hashlib.md5(unhashed).hexdigest()

if __name__ == "__main__":
    app.debug = True
    app.run()
