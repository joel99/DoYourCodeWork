#mongo code to be placed

#User data functions

"""
isValidAccountInfo(uN, hP)
Given:
    uN - username
    hP - hashed pass 
Returns:
    boolean of validity of account info (for login)
"""
def isValidAccountInfo( uN, hP ):
    return False

"""
getUserID(uN)
Given:
    uN - username 
Returns:
    int of userID for given username
"""
def getUserID( uN ):
    return None

"""
getUsername(uID)
Given:
    uID - userID 
Returns:
    str of username for given userID
"""
def getUsername( uID ):
    return None

"""
registerAccountInfo(uN)
Given:
    uN - username
    hP - hashed pass
Returns:
    boolean of whether account was successfully created
"""
def registerAccountInfo( uN, hP ):
    return False

"""
doesUserExist(uN)
Given:
    uN - username 
Returns:
    boolean of whether a username is already taken
"""
def doesUserExist( uN ):
    return False

"""
getPass(uID)
Given:
    uID - userID 
Returns:
    str of password for a given userID
"""
def getPass( uID ):
    return None

"""
changePass(uID, newPass)
Given:
    uID - userID
    newPass - new pass
Returns:
    boolean of whether a password was successfully changed
"""
def changePass( uID, newPass ):
    return None
