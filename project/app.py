from flask import Flask, render_template, request, session, url_for, redirect
from utils import users, mapUtil, gallery
import json

app = Flask(__name__)
app.secret_key = "secrets"

# Site Navigation

# TODO:
# Feedback on user actions (failed registration, etc)
# Replace isLoggedIn with UserID for better UI in toolbar

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

# == Gallery Browsing ==========================
@app.route("/gallery/")
def gallery():
    return redirect( "/gallery/browse/page/1" )

#To do - figure out number of pages / how to link them at bottom (reference database)
@app.route("/gallery/browse/<pageNum>")
def galleryPage(pageNum):
    data = gallery.getPage(pageNum)
    if len(data) == 0:
        #rip come back later
        return render_template( "emptyGallery.html", isLoggedIn = isLoggedIn() )
    return render_template( "gallery.html", isLoggedIn = isLoggedIn(), mapLinkData = data )    

# == Queried ===================================
@app.route("/gallery/search/<searchQuery>") #Umm, should this be a GET request
def gallerySearch(searchQuery):
    data = gallery.search(searchQuery)
    if len(data) == 0:
        return render_template( "searchEmptygallery.html", isLoggedIn = isLoggedIn() )
    return render_template( "gallery.html", isLoggedIn = isLoggedIn(), mapLinkData = data )    
    
@app.route("/help/")
def help():
    return render_template( "help.html", isLoggedIn = isLoggedIn() )


@app.route("/map/<mapID>")
def mapPage(mapID):
    locked = True
    if isPublished(mapID):
        locked = False
    if isLoggedIn():
        uID = getUserID()
        if mapUtil.ownsMap(uID, mapID):
            owns = True
            locked = False
    #if map is public, all viewers can view it (unlocked)
    #if map is private, only owner can view it (and gets link to edit on page)
    return render_template( "map.html", isLoggedIn = isLoggedIn(), owned = owns, lock = locked )

#EDITING PAGE
@app.route("/map/<mapID>/edit")
def mapEdit(mapID):
    if not mapUtil.ownsMap(uID, mapID):
        return redirect( url_for('root') )
    else:
        data = mapUtil.getMapData(mapID)
        return render_template( "editMap.html", mapData = data ) 

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
    if isLoggedIn():
        return session["uID"]
    else:
        return None

if __name__ == "__main__":
    app.debug = True
    app.run()
