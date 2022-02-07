(function () {
    var FLY_GAME_CHANNEL = "FLY-GAME-CHANNEL";
    var consoleID;
    var avatarName;
    var props;
    var myPosition;
    var consoleFound = false;
    var myName = "";
    var myID;
    var SEARCH_RADIUS = 10000;


    this.preload = function (entityID) {
        this.entityID = entityID;
        if (!consoleFound) {
            findConsole();
        }
        myID = entityID;
        myPosition = Entities.getEntityProperties(this.entityID, 'position').position;
        myName = Entities.getEntityProperties(this.entityID, 'name').name;
    };

    function findConsole() {
        var entities = Entities.findEntities(myPosition, SEARCH_RADIUS);
        for (var i in entities) {
            props = Entities.getEntityProperties(entities[i]);
            if (props.name === "BasinskyFlygameConsole") {
                consoleID = props.id;
                print(JSON.stringify("Found Console"+consoleID));
                consoleFound =true;
            }
        }
    }

    // function sendDataToConsole() {
    //     avatarName = MyAvatar.displayName;
    //     if (consoleID) {
    //         Entities.callEntityServerMethod(
    //             consoleID,
    //             "receiveDataFromWaypoint",
    //             [avatarName,MyAvatar.sessionUUID,myName,myID]
    //         );
    //         print(JSON.stringify("Try to send ..... " + avatarName + " + " + myName));
    //     }
    // }

    function sendDataToConsole() {
        avatarName = MyAvatar.displayName;

        Messages.sendMessage(FLY_GAME_CHANNEL, JSON.stringify({
            'command': 'script-to-master-server-receive-data-from-waypoint',
            'data': {
                'param': [avatarName, MyAvatar.sessionUUID, myName, myID]
            }
        }));

        print(JSON.stringify("Try to send ..... " + avatarName + " + " + myName));
    }

    function waypointEntered() {
        sendDataToConsole();
    }
    this.enterEntity = function(entityID) {
        console.log("Entered Entity... " + entityID)
        waypointEntered(entityID);
    };
});