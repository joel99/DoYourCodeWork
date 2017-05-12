from flask import Flask, render_template, request, session, url_for, redirect
from utils import users
import json

app = Flask(__name__)
app.secret_key = "secrets"

# Site Navigation

# TODO:
# Feedback on user actions (failed registration, etc)

# NOTE: ALL ROUTES NEED TO END WITH / (ex. /login/ instead of /login)

# Pages ========================================

@app.route("/")
def root():
    return render_template( "index.html", isLoggedIn = isLoggedIn() )

@app.route("/settings/")
def settings():
    if isLoggedIn():
        return render_template( "settings.html" )
    return redirect( url_for('root') )

# == General Browsing ==========================
@app.route("/gallery/")
def gallery():
    return render_template( "gallery.html", isLoggedIn = isLoggedIn() )

# == Queried ===================================
@app.route("/gallery/<specific>")
def wow():
    return None #ummm

@app.route("/help/")
def help():
    return render_template( "help.html", isLoggedIn = isLoggedIn() )


@app.route("/map/")
def mapPage():
    return render_template( "map.html", isLoggedIn = isLoggedIn() )



# Login Routes ======================================

@app.route("/login/", methods=["POST"])
def login():
    # request
    uN = request.form["username"]
    pwd = request.form["password"]
    #auth
    if users.isValidAccountInfo( uN, pwd ):
        session['uID'] = users.getUserID( uN )
    return redirect( url_for('root') )

@app.route("/logout/")
def logout():
    session.pop('uID')
    return redirect( url_for('root') )

@app.route("/register/", methods=["POST"])
def register():
    # request
    uN = request.form["username"]
    pwd = request.form["password"]
    #reg
    if users.canRegister(uN):
        users.registerAccountInfo( uN, pwd )
        session['uID'] = users.getUserID( uN )
    return redirect( url_for('root') )

# Setting Routes ======================================

@app.route('/changePass/', methods = ['POST'])
def changePass():
    if isLoggedIn():
        d = request.form
        old = d["pass"]
        new1 = d["pass1"]
        new2 = d["pass2"]
        users.changePass( getUserID(), old, new1, new2 )
    return redirect(url_for('root'))


# General Helpers =====================================

# Login Helpers
def isLoggedIn():
    return "uID" in session

def getUserID():
    return session["uID"]

if __name__ == "__main__":
    app.debug = True
    app.run()
