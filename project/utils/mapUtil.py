#Map database functions

def exists(mapID):
    return True

def ownsMap(uID, mapID):
    if exists(mapID):
        return True#insert something else
    else:
        return False

def isPublished(mapID):
    if exists(mapID):
        return True#insert code
    else:
        return False
    
def getMapData(mapID):
    return None

