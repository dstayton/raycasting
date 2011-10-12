// Contains all movement related functions
Raycaster.Movement = function()
{
    var player = Raycaster.Objects.player;
    
    /****************** / Private methods / *****************/
    // Make the player turn by increasing its viewing angle
    var turn = function(angle)
    {
        player.angle.turn(angle);
        Raycaster.engine.redraw();
    };
    
    // Make the player walk forward or backwards
    var walk = function(forward)
    {
        step = forward ? Raycaster.Constants.movementStep : -Raycaster.Constants.movementStep;
        
        var delta = Raycaster.Utils.getDeltaXY(player.angle, step);
        
        var angle = forward 
            ? player.angle 
            : new Raycaster.Classes.Angle(player.angle.degrees + 180);
            
        var intersection = Raycaster.Raycasting.findWall(angle);
            
        if (!intersection || intersection.distance > 50) {
            player.x = Math.round(player.x + delta.x);
            player.y = Math.round(player.y - delta.y);
        }
        
        Raycaster.engine.redraw();
    };
    
    // Make player strafe left or right
    var strafe = function(left)
    {
        var angle = left 
            ? new Raycaster.Classes.Angle(player.angle.degrees + 90)
            : new Raycaster.Classes.Angle(player.angle.degrees - 90);
        
        var delta = Raycaster.Utils.getDeltaXY(angle, Raycaster.Constants.movementStep);
            intersection = Raycaster.Raycasting.findWall(angle);
        
        if (!intersection || intersection.distance > 20) {
            player.x = Math.round(player.x + delta.x);
            player.y = Math.round(player.y - delta.y);
        }
        
        Raycaster.engine.redraw();
    };
    
    /****************** / Public methods / *****************/
    // Update movement
    var update = function()
    {
        if (Raycaster.Objects.keys.arrowLeft.pressed) {
            if (Raycaster.Objects.keys.shift.pressed) {
                strafe(true);
            }
            else {
                turn(Raycaster.Constants.turningStep);
            }
        }
        
        if (Raycaster.Objects.keys.arrowRight.pressed) {
            if (Raycaster.Objects.keys.shift.pressed) {
                strafe(false);
            }
            else {
                turn(-Raycaster.Constants.turningStep);
            }
        }
        
        if (Raycaster.Objects.keys.arrowUp.pressed) {
            walk(true);
        }
        
        if (Raycaster.Objects.keys.arrowDown.pressed) {
            walk(false);
        }
        
        if (Raycaster.Objects.keys.lessThan.pressed) {
            strafe(true);
        }
        else if (Raycaster.Objects.keys.greaterThan.pressed) {
            strafe(false);
        }
        
        if (Raycaster.Objects.keys.esc.pressed) {
            clearInterval(Raycaster.Objects.gameloopInterval);
        }
    }
    
    // Bind the arrow keydown events
    var init = function()
    {
        // Prevents default event handling
        var preventDefault = function(e) 
        {
            e.preventDefault 
                ? e.preventDefault() 
                : e.returnValue = false;
        };
        
        // Handler for keydown events
        var keyDownHandler = function (e) 
        {
            var keyCode = e.keyCode || e.which;

            for (var name in Raycaster.Objects.keys) {
                if (Raycaster.Objects.keys[name].code == keyCode) {
                    Raycaster.Objects.keys[name].pressed = true;
                    preventDefault(e);
                }
            }
        };
        
        // Handler for keyup events
        var keyUpHandler = function (e) 
        {
            var keyCode = e.keyCode || e.which;
            
            for (var name in Raycaster.Objects.keys) {
                if (Raycaster.Objects.keys[name].code == keyCode) {
                    Raycaster.Objects.keys[name].pressed = false;
                    preventDefault(e);
                }
            }
        };
        
        window.addEventListener("keydown", keyDownHandler, false);
        window.addEventListener("keyup", keyUpHandler, false);
        
        // Bind key icons to mobile devices which have no keyboard
        var keys = document.getElementsByClassName("keys");

        for (var i = 0, n = keys.length; i < n; ++i) {
            var key = keys[i];
            var keyCode = parseInt(key.getAttribute("data-code"), 0);
            
            (function(k, kc) {
                k.addEventListener("mouseover", function() {
                    keyDownHandler({ keyCode: kc });
                    return false;
                }, false);
                k.addEventListener("mouseout", function() {
                    keyUpHandler({ keyCode: kc });
                    return false;
                }, false);
            }(key, keyCode));
        }
        
        // Redraw when settings change
        document.getElementById("chkTextures").addEventListener('change', Raycaster.engine.redraw);
        document.getElementById("chkLighting").addEventListener('change', Raycaster.engine.redraw);
        document.getElementById("chkMiniMap").addEventListener('change', Raycaster.engine.redraw);
        document.getElementById("chkSky").addEventListener('change', Raycaster.engine.redraw);
    };
    
    return {
        update: update,
        init: init
    };
}();