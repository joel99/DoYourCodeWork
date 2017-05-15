#Map database functions

"""
exists(mapID)
Given:
  mapID - unique id given to each map
Returns:
  boolean of whether a mapID is associated with a created map
"""
def exists(mapID):
    return True

"""
ownsMap(uID, mapID)
Given:
  uID - unique id given to each user
  mapID - unique id given to each map
Returns:
  boolean of if a given user is the owner of a given map
"""
def ownsMap(uID, mapID):
    if exists(mapID):
        return True#insert something else
    else:
        return False

"""
isPublished(mapID)
Given:
  mapID - unique id given to each map
Returns:
  boolean of if a given map has been published already
"""
def isPublished(mapID):
    if exists(mapID):
        return True#insert code
    else:
        return False

"""
getMapData(mapID)
Given:
  mapID - unique id given to each map
Returns:
  <data> form of the data held in a given map
"""    
def getMapData(mapID):
    return None

