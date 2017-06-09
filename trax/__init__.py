from flask import Flask, render_template, request, session, url_for, redirect
from utils import users, mapUtil, gallery
import json, os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "secrets"

UPLOAD_FOLDER = "/maps/"
ALLOWED_EXTENSIONS = set(['jpg', 'png'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Site Navigation

# TODO:
# Feedback on user actions (failed registration, etc)
# Replace isLoggedIn with UserID for better UI in toolbar

# NOTE: ALL ROUTES NEED TO END WITH / (ex. /login/ instead of /login)

# Pages ========================================

@app.route("/")
def root():
    if 'message' in request.args:
        return render_template( "home.html", isLoggedIn = isLoggedIn(), message=request.args['message'] )
    return render_template( "home.html", isLoggedIn = isLoggedIn())


@app.route("/settings/")
def settings():
    if isLoggedIn():
        return render_template( "settings.html" )
    return redirect( url_for('root') )

# == Gallery Browsing ==========================
@app.route("/gallery/")
def galleryRoute():
    return redirect( "/gallery/browse/page/1" )

#To do - figure out number of pages / how to link them at bottom (reference database)
@app.route("/gallery/browse/page/<pageNum>")
def galleryPage(pageNum):
    data = gallery.getPage( getUserID(), pageNum) #<-- get back later
    if len(data) == 0:
        #rip come back later
        return render_template( "gallery.html", isLoggedIn = isLoggedIn(), message = "There are no maps at this time :( Come back later" )
    return render_template( "gallery.html", isLoggedIn = isLoggedIn(), mapLinkData = data , message = "You are viewing the gallery")

# == Queried ===================================
@app.route("/gallery/search/") #Umm, should this be a GET request / Done - JC
def gallerySearch():
    if 'searchQ' in request.args:
        searchQuery = request.args['searchQ']
        data = gallery.getPage( getUserID(), 1, searchQuery)
        if data == None:
            return render_template( "gallery.html", isLoggedIn = isLoggedIn() , message = "There were no search results for \"" + searchQuery + "\"")
    return render_template( "gallery.html", isLoggedIn = isLoggedIn(), mapLinkData = data )

@app.route("/gallery/mymaps/")
def mymaps():
    data = mapUtil.userFind(getUserID())
    #data = retrieve my maps function
    if len(data) == 0 or data == None:
        return render_template("gallery.html", isLoggedIn = isLoggedIn(), message = "You have no maps! Create one!")
    return render_template("gallery.html", isLoggedIn = isLoggedIn(), mapLinkData = data)

@app.route("/help/")
def help():
    return render_template( "help.html", isLoggedIn = isLoggedIn() )


@app.route("/map/<mapID>")
def mapPage(mapID):
    locked = True
   # if isPublished(mapID):
   #     locked = False
    if isLoggedIn():
        uID = getUserID()
        if mapUtil.ownsMap(uID, mapID):
            owns = True
            locked = False
    #if map is public, all viewers can view it (unlocked)
    #if map is private, only owner can view it (and gets link to edit on page)
    return render_template( "mapView.html", isLoggedIn = isLoggedIn(), owned = owns, lock = locked )

#EDITING PAGE
@app.route("/map/edit/")
def mapEditTest():
    return render_template("mapEdit.html")


@app.route("/map/<mapID>/edit")
def mapEdit(mapID):
    if not mapUtil.ownsMap(getUserID(), mapID):
        return redirect( url_for('root') )
    else:
        session["mID"] = mapID
        data = mapUtil.getMapData(mapID)
        return render_template( "mapEdit.html", isLoggedIn = isLoggedIn() , mapLinkData = data)

#MAP REDIRECT PAGE
@app.route("/create/", methods=["POST"])
def mapRedirect():
    mapName = request.form["mapName"]
    mapId = mapUtil.makeNewMap(mapName, getUserID()) #returns id
    session["mID"] = mapId
    return redirect("/map/" + str(mapId) + "/edit")#url_for(mapEdit(mapId))

#MAP SAVING
@app.route("/saveData/", methods=["POST"])
def mapSave():
    mapData = request.form.get("canvas")
    mapID = session["mID"]
    print mapUtil.store( mapID, mapData )
    print json.loads(mapData)
    return mapData

#MAP LOAD
@app.route("/loadData/", methods=["POST"])
def mapLoad():
    mapData = mapUtil.getMapData(int(session["mID"])) 
    print "LOADING DATA\n\n\n"
    print mapData
    print "LOADING DATA\n\n\n"
    #return mapData
    print json.dumps(mapData)
    return json.dumps(mapData)
    #return null


def allowed_file(filename):
	return "." in filename and filename.rsplit( ".", 1 )[1].lower() in ALLOWED_EXTENSIONS

@app.route("/map/upload/", methods=["POST"])
def upload():
    if "upload" not in request.files:
        print request.files
        print "nope"
        return redirect(url_for( "mapEdit", mapID = session["mID"]) )
    f = request.files["upload"]
    if f.name == '':
        print "also nope"
        return redirect(url_for( "mapEdit", mapID = session["mID"]))
    if f and allowed_file(f.name):
		filename = secure_filename(f.name)
		f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		mapUtil.addImage(os.path.abspath( filename ), session["mID"])
		print "nice"
		return redirect(url_for( "mapEdit", mapID = session["mID"]))
    print allowed_file(f.name)
    return redirect(url_for( "mapEdit", mapID = session["mID"]))

# Login Routes ======================================

@app.route("/login/", methods=["POST"])
def login():
    # request
    uN = request.form["username"]
    pwd = request.form["password"]
    #auth
    msg = ""
    if 'login' in request.form:
        if users.isValidAccountInfo( uN, pwd ):
            session['uID'] = users.getUserID( uN )
        else:
            msg = "Invalid credentials"
    else:
        message = "How"
    return redirect( url_for('root', message=msg) )

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
    msg = ""
    if users.canRegister(uN):
        users.registerAccountInfo( uN, pwd )
        session['uID'] = users.getUserID( uN )
    else:
        msg = "User already exists"
    return redirect( url_for('root', message=msg) )

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
    #app.run()
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))
    
print __name__

