#initialize mongo database

from pymongo import MongoClient

server = MongoClient( "127.0.0.1" )
#server = MongoClient( "149.89.150.100" )

db = server.dycw

cM = db.maps #collection of maps

#Map database functions

"""
exists( mapID )
Given:
  mapID - unique id given to each map
Returns:
  boolean of whether a mapID is associated with a created map
"""
def exists( mapID ):
    finder = cM.find_one(
        { "mapID" : mapID }
        )
    return finder is not None

"""
ownsMap( uID, mapID )
Given:
  uID - userID of a user
  mapID - unique id given to each map
Returns:
  boolean of if a given user is the owner of a given map
"""
def ownsMap( uID, mapID ):
    if exists( mapID ):
        finder = cM.find_one(
            { "mapID" : mapID }
            )
        return finder["uID"] == uID 
    else:
        return False

"""
isPublished( mapID )
Given:
  mapID - unique id given to each map
Returns:
  boolean of if a given map has been published already
"""
def isPublished( mapID ):
    if exists( mapID ):
        finder = cM.find_one(
            { "mapID" : mapID }
            )
        return finder["published"] == 1
    else:
        return False

"""
getMapData( mapID )
Given:
  mapID - unique id given to each map
Returns:
  <data> form of the data held in a given map
"""    
def getMapData( mapID ):
    finder = cM.find_one(
        { "mapID" : mapID }
        )
    return finder["data"] 

"""
makeNewMap( mapName )
Given:
  mapName - yes
"""
def makeNewMap( mapName ) :
    return None
