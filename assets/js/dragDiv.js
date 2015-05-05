var DeviceInteractionModule = (function() {
    var $w = $(window);
    var container = {
        $element: $('#devicesContainer') || null,
        $listRootElem: $('#devicesList') || null,
        $dragHandle: null,
        minHeightDesktop: 200,
        contentHeight: $("#devicesList")[0].scrollHeight,
        dragBottomOffset: 20,
        update: function() {
            var newContentHeight = this.$listRootElem[0].scrollHeight + this.$dragHandle.height() + this.dragBottomOffset;
            // if content (list) height has changed due to screen resize, change maxHeight of resizable div accordingly
            if (newContentHeight != this.contentHeight) {
                this.contentHeight = newContentHeight;
                this.$element.resizable("option", "maxHeight", this.contentHeight);
                // if resizable div's height becomes greater than content(list)'s height due to screen size, change it accordingly
                if (this.$element.height() > this.contentHeight) {
                    this.$element.stop().animate({
                        height: this.contentHeight
                    }, 250);
                }
            }
        },
        updateMobile: function() {
            this.update();
            this.$element.css({
                whiteSpace: "nowrap"
            });
            this.$element.resizable("disable");
            this.$element.css({
                minHeight: ""
            });
        },
        updateDesktop: function() {
            this.update();
            if (this.$element.resizable("option", "disabled")) {
                this.$element.css({
                    whiteSpace: ""
                });
                this.$element.resizable("enable");
                this.$element.animate({
                    minHeight: container.minHeightDesktop
                }, 250);
            }
        }
    };


    $.ajax({
        url: './assets/js/dummyDevicesDB.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            for (var device in data) {
                if (data.hasOwnProperty(device)) {
                    for (var i in data[device]) {
                        container.$listRootElem.append(
                            createDeviceElement(data[device][i].icon, data[device][i].name));
                    }
                }
            }
        }
    });


    (function() { // init

        container.$element.resizable({
            handles: 's',
            maxHeight: container.contentHeight,
            minHeight: container.minHeightDesktop
        });
        //set resize handle style
        container.$dragHandle = $('.ui-resizable-handle ') || null;
        container.$dragHandle.css({
            background: '#fff url("assets/images/drag.svg") no-repeat scroll center center',
            backgroundSize: 'contain',
            height: '25px',
            border: '1px solid #DDD'
        });
    }());

    responsiveBehaviour = function() {
        if (isMobileWidth()) { // if  mobile width unbind scroll
            container.updateMobile();
        } else {
            container.updateDesktop();
        }
    };


    //helper functions
    createDeviceElement = function(icon, caption) {
        return (
            $('<li>').append(
                $('<figure>')
                .attr('class', 'batman')
                .append($('<img>').attr({
                    src: icon,
                    height: "30px"
                }))
                .append($('<figcaption>').html(caption))));
    };


    isMobileWidth = function() {
        return $w.width() < 900;
    };



    $w.load(responsiveBehaviour);
    $w.resize(responsiveBehaviour);

})();

