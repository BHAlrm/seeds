/**
 * Created by BHAlrM on 8/23/2015 AD.
 */
module richstudio {
    function ImageCropDirectiveFactory() {

        var directive:ng.IDirective = {
            restrict: 'A',
            templateUrl: 'richstudio/management/crop/imageCrop.template.html',
            scope: {
                aspectRatio: '=?',
                displayWidth: '=?',
                displayHeight: '=?',
                scaledWidth: '=?',
                scaledHeight: '=?',
                scaledTop: '=?',
                scaledLeft: '=?',
                imgLoader: '=?',
                originalImageWidth: '=?',
                originalImageHeight: '=?',
                imgSrc: '=',
            },
            transclude: false,
            controller: ImageCropController
        };

        return directive;
    }

    export interface ImageCropScope extends ng.IScope {
        aspectRatio:string;
        displayHeight:number;
        displayWidth:number;
        scaledHeight:number;
        scaledWidth:number;
        scaledLeft:number;
        scaledTop:number;

        currentImageWidth:number;
        currentImageHeight:number;

        originalImageWidth:number;
        originalImageHeight:number;
        scaleFactor:number;

        imgSrc:string;
    }

    class ImageCropController {
        static $inject:string[] = ['$scope', '$element', '$window', '$document'];

        // Representation of Crop DIV.
        rectangleLeft:number;
        rectangleRight:number;
        rectangleTop:number;
        rectangleWidth:number;
        rectangleHeight:number;
        focusedOnCrop = false;
        ratioValues:string[];
        offset:ClientRect;


        // DOM For Manipulatable Elements.
        imageCropSelectorDiv = this.$window.document.getElementById("imageCropSelector");
        imageCropSelect:any;
        imageTag:HTMLImageElement; // Any interaction with this should verify that the elemented has loaded.

        // Translation
        draggingRectangle = false;
        originalDragX = 0;
        originalDragY = 0;
        dragCorrectionX = 0;
        dragCorrectionY = 0;

        // Resizing
        resizingRectangle = false;
        startResizeMouseX = 0;
        startResizeMouseY = 0;
        currentResizeOrigin = 0;

        // Rectangle 'Creation'
        originalMouseX = 0;
        originalMouseY = 0;

        mouseXRelative = 0;
        mouseYRelative = 0;

        // Account for possible scrolling.
        scrollLeft = 0;
        scrollTop = 0;

        // ratio
        aspectRatioX:number;
        aspectRatioY:number;


        mouseModifyingRectangle = false;
        currentResizingFunc:Function;

        calculateMouseXRelative = (e:MouseEvent) => {
            if (this.scrollLeft) {
                this.mouseXRelative = e.pageX - this.offset.left - this.scrollLeft;
            } else {
                this.mouseXRelative = e.pageX - this.offset.left;
            }
        };

        calculateMouseYRelative = (e:MouseEvent)=> {
            if (this.scrollTop) {
                this.mouseYRelative = e.pageY - this.offset.top - this.scrollTop;
            } else {
                this.mouseYRelative = e.pageY - this.offset.top;
            }
        };

        startTranslation = (e:MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.draggingRectangle = true;
            this.originalDragX = e.pageX;
            this.originalDragY = e.pageY;
        };

        midTranslation = (e:MouseEvent) => {
            var newDragX = e.pageX;
            var newDragY = e.pageY;

            this.translate(this.originalDragX - newDragX, this.originalDragY - newDragY);
            this.originalDragX = newDragX;
            this.originalDragY = newDragY;
            this.drawRectangle();
        };

        onMouseUpFunction = (e:JQueryEventObject) => {
            this.originalDragX = 0;
            this.originalDragY = 0;
            e.preventDefault();
            this.resetInteractions();

            if (this.resizingRectangle) {
                this.stopResizing();
            }
        };

        midResizing = (e:MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            var currentResizeMouseX = e.pageX;
            var currentResizeMouseY = e.pageY;

            this.currentResizingFunc(this.startResizeMouseX - currentResizeMouseX, this.startResizeMouseY - currentResizeMouseY, this.currentResizeOrigin);
            this.startResizeMouseX = currentResizeMouseX;
            this.startResizeMouseY = currentResizeMouseY;
            this.drawRectangle();
        };


        startResizing = (e:MouseEvent, origin:number, resizeFunction:Function) => {
            e.preventDefault();
            e.stopPropagation();
            this.startResizeMouseX = e.pageX;
            this.startResizeMouseY = e.pageY;

            this.resizingRectangle = true;
            this.currentResizeOrigin = origin;
            this.currentResizingFunc = resizeFunction;
        };

        onScrollFunction = () => {
            this.scrollLeft = (this.$window.pageXOffset || this.$document.scrollLeft()) - (this.$window.document.documentElement.clientLeft || 0);
            this.scrollTop = (this.$window.pageYOffset || this.$document.scrollTop()) - (this.$window.document.documentElement.clientTop || 0);
        };

        resetInteractions = () => {
            this.draggingRectangle = false;
            this.mouseModifyingRectangle = false;
        };


        horizontalScaling = (xDelta:number, yDelta:number, origin:number)=> {
            if (origin === 0) { // Left
                this.rectangleWidth += xDelta;
                this.rectangleLeft -= xDelta;
            } else { // Right
                this.rectangleWidth -= xDelta;
            }

            if (this.rectangleWidth < 0) {
                this.rectangleWidth = 0;
            }


            if (this.rectangleLeft < 0) {
                this.rectangleLeft = 0;
            }

            if (this.rectangleWidth + this.rectangleLeft > this.imageTag.offsetWidth) {
                this.rectangleWidth = this.imageTag.offsetWidth - this.rectangleLeft;
            }


            if (this.$scope.aspectRatio) {

                if (this.rectangleWidth * (this.aspectRatioY / this.aspectRatioX) + this.rectangleTop > this.imageTag.offsetHeight) {
                    this.rectangleWidth = (this.imageTag.offsetHeight - this.rectangleTop) / (this.aspectRatioY / this.aspectRatioX);
                }

                this.rectangleHeight = this.rectangleWidth * (this.aspectRatioY / this.aspectRatioX);
            }

        };

        verticalScaling = (xDelta:number, yDelta:number, origin:number) => {
            if (origin === 0) { // Top
                this.rectangleHeight += yDelta;
                this.rectangleTop -= yDelta;
            } else { // Bottom
                this.rectangleHeight -= yDelta;
            }

            if (this.rectangleHeight < 0) {
                this.rectangleHeight = 0;
            }

            // Make sure the div doesn't break out of its container.
            if (this.rectangleTop < 0) {
                this.rectangleTop = 0;
            }

            if (this.rectangleHeight + this.rectangleTop > this.imageTag.offsetHeight) {
                this.rectangleHeight = this.imageTag.offsetHeight - this.rectangleTop;
            }


            // Make sure that we maintain our ratio
            if (this.$scope.aspectRatio) {
                if (this.rectangleHeight * (this.aspectRatioX / this.aspectRatioY) + this.rectangleLeft > this.imageTag.offsetWidth) {
                    this.rectangleHeight = (this.imageTag.offsetHeight - this.rectangleLeft) / (this.aspectRatioX / this.aspectRatioY);
                }

                this.rectangleWidth = this.rectangleHeight * (this.aspectRatioX / this.aspectRatioY);
            }
        };

        diagonalScaling = (xDelta:number, yDelta:number, origin:number) => {
            if (origin === 0) { // Top-left
                this.horizontalScaling(xDelta, yDelta, 0);
                this.verticalScaling(xDelta, yDelta, 0);
            } else if (origin === 1) { // Top-right
                this.verticalScaling(xDelta, yDelta, 0);

                if (!this.$scope.aspectRatio) {
                    this.horizontalScaling(xDelta, yDelta, 1);
                }
            } else if (origin === 2) { // Bottom-right
                this.verticalScaling(xDelta, yDelta, 1);

                if (!this.$scope.aspectRatio) {
                    this.horizontalScaling(xDelta, yDelta, 1);
                }
            } else if (origin === 3) { // Bottom-left
                this.horizontalScaling(xDelta, yDelta, 0);

                if (!this.$scope.aspectRatio) {
                    this.verticalScaling(xDelta, yDelta, 1);
                }
            }

            this.drawRectangle();
        };

        translate = (xDelta:number, yDelta:number) => {

            if (this.rectangleLeft - xDelta > 0 && this.rectangleLeft - xDelta + this.rectangleWidth < this.imageTag.offsetWidth) {
                this.rectangleLeft -= xDelta;
            } else if (this.rectangleLeft - xDelta < 0) {
                this.rectangleLeft = 0;
            } else if (this.rectangleLeft - xDelta + this.rectangleWidth > this.imageTag.offsetWidth) {
                this.rectangleLeft = this.imageTag.offsetWidth - this.rectangleWidth;
            }

            if (this.rectangleTop - yDelta > 0 && this.rectangleTop - yDelta + this.rectangleHeight < this.imageTag.offsetHeight) {
                this.rectangleTop -= yDelta;
            } else if (this.rectangleTop - yDelta < 0) {
                this.rectangleTop = 0;
            } else if (this.rectangleTop - yDelta + this.rectangleHeight > this.imageTag.offsetHeight) {
                this.rectangleTop = this.imageTag.offsetHeight - this.rectangleHeight;
            }
        };


        stopTranslation = () => {
            this.resizingRectangle = false;
        };


        stopResizing = () => {
            this.resizingRectangle = false;
        };

        drawRectangle = () => {
            // Move the correct part of the background image into the view/
            this.imageCropSelectorDiv.style.backgroundPosition = "-" + (this.rectangleLeft + 1) + "px" + " -" + (this.rectangleTop + 1) + "px";
            this.imageCropSelectorDiv.style.backgroundSize = this.imageTag.offsetWidth + "px";
            this.imageCropSelectorDiv.style.backgroundRepeat = "no-repeat";

            // Set the top and left position of the div. 
            this.imageCropSelectorDiv.style.left = this.rectangleLeft + "px";
            this.imageCropSelectorDiv.style.top = this.rectangleTop + "px";

            // Set Div Height and Width
            this.imageCropSelectorDiv.style.width = this.rectangleWidth + "px";
            this.imageCropSelectorDiv.style.height = this.rectangleHeight + "px";

            this.selectedBackgroundColor();

            this.$scope.displayHeight = Math.round(this.rectangleHeight);
            this.$scope.displayWidth = Math.round(this.rectangleWidth);
            this.$scope.scaledHeight = Math.round(this.rectangleHeight * this.$scope.scaleFactor);
            this.$scope.scaledWidth = Math.round(this.rectangleWidth * this.$scope.scaleFactor);
            this.$scope.scaledLeft = Math.round(this.rectangleLeft * this.$scope.scaleFactor);
            this.$scope.scaledTop = Math.round(this.rectangleTop * this.$scope.scaleFactor);
            this.$scope.$parent.$apply();
        };


        resetBackgroundColor = () => {
            this.imageCropSelectorDiv.style.display = "none";
            angular.element(this.$element[0].children[2])[0].style.backgroundColor = "transparent";
        }

        selectedBackgroundColor = () => {
            this.imageCropSelectorDiv.style.display = "block";
            angular.element(this.$element[0].children[2])[0].style.backgroundColor = "rgba(0,0,0,0.3)";
        }


        calculateRectangleDimensions = (mouseX:number, mouseY:number, oldMouseX:number, oldMouseY:number) => {
            var tempHolder:number;
            var width:number;
            var height:number;

            if (mouseX < oldMouseX) {
                tempHolder = mouseX;
                mouseX = oldMouseX;
                oldMouseX = tempHolder;
            }

            if (mouseY < oldMouseY) {
                tempHolder = mouseY;
                mouseY = oldMouseY;
                oldMouseY = tempHolder;
            }

            width = mouseX - oldMouseX;

            // Figure out if enforcing the aspect ratio any further than we already have would
            // break the crop out of the parent div.
            if (this.$scope.aspectRatio) {
                if (width * (this.aspectRatioY / this.aspectRatioX) + oldMouseY > this.imageTag.offsetHeight) {
                    width = (this.imageTag.offsetHeight - oldMouseY) / (this.aspectRatioY / this.aspectRatioX);
                }
            }

            if (this.$scope.aspectRatio) {
                height = width * (this.aspectRatioY / this.aspectRatioX);
            } else {
                height = mouseY - oldMouseY;
            }


            oldMouseY += this.dragCorrectionY;
            oldMouseX += this.dragCorrectionX;


            if (oldMouseX + width > this.imageTag.offsetWidth) {
                oldMouseX = this.imageTag.offsetWidth - width;
            }

            if (oldMouseY + height > this.imageTag.offsetHeight) {
                oldMouseY = this.imageTag.offsetHeight - height;
            }

            // Prevent crop-box from leaving the boundaries of the div. Snap
            // to the closest edge if outside of element. 
            if (oldMouseX < 0) {
                oldMouseX = 0;
                this.dragCorrectionX = 0;
            }

            if (oldMouseY < 0) {
                oldMouseY = 0;
                this.dragCorrectionY = 0;
            }

            this.rectangleLeft = oldMouseX;
            this.rectangleTop = oldMouseY;
            this.rectangleWidth = width;
            this.rectangleHeight = height;
        };

        constructor(private $scope:ImageCropScope,
                    private $element:ng.IAugmentedJQuery,
                    private $window:ng.IWindowService,
                    private $document:ng.IDocumentService) {
            this.activate();

        }

        private activate() {
            if (this.$scope.aspectRatio) {
                this.ratioValues = this.$scope.aspectRatio.split("/");
                this.aspectRatioX = parseFloat(this.ratioValues[0]);
                this.aspectRatioY = parseFloat(this.ratioValues[1]);
            }

            // We have to load the original image in order to get it
            this.$scope.originalImageWidth = 0;
            this.$scope.originalImageHeight = 0;
            
            this.$element.attr('style', 'position:relative;');

            this.registerRatioListener();
            this.registerSrcListener();
            this.registerImageValidatorOnElement();
            this.registerInstantiateTranslateEvent();
            this.registerInstantiateCropRectangle();
            this.registerMoveCropRecangleEvent();
            this.registerDiagonalScaling();
        }

        private registerRatioListener() {
            this.$scope.$watch("aspectRatio", (newValue:string, oldValue:string) => {
                if (newValue) {
                    if (newValue !== oldValue && newValue.split("/").length == 2) {
                        this.ratioValues = newValue.split("/");
                        if (this.ratioValues.length == 2) {
                            this.aspectRatioX = parseFloat(this.ratioValues[0]);
                            this.aspectRatioY = parseFloat(this.ratioValues[1]);
                        }

                        this.horizontalScaling(0, 0, 0);

                        // If we don't perform this check, and we go from false, to true aspectRatio,
                        // a "0x0" rectangle will draw, and set the background to black. 
                        if (this.rectangleLeft || this.rectangleRight || this.rectangleRight || this.rectangleHeight) {
                            this.drawRectangle();
                        }
                    }
                }
            });
        }

        private registerSrcListener() {
            // Handle a change in the image we are cropping.
            this.$scope.$watch("imgSrc", (newValue:string, oldValue:string)=> {
                if (newValue !== oldValue) {
                    this.imageCropSelect.style.backgroundImage = newValue;

                    // There are a lot of default values that we need to reset.
                    this.$window.document.getElementById("cropToolLoading").style.display = "block";
                    this.rectangleLeft = 0;
                    this.rectangleTop = 0;
                    this.rectangleWidth = 0;
                    this.rectangleHeight = 0;

                    this.$scope.displayHeight = 0;
                    this.$scope.displayWidth = 0;
                    this.$scope.scaledHeight = 0;
                    this.$scope.scaledWidth = 0;
                    this.$scope.scaledLeft = 0;
                    this.$scope.scaledTop = 0;

                    this.$scope.imgSrc = newValue;
                    this.resetBackgroundColor();

                    // We need to make sure the image has loaded before we try and get the height.
                    angular.element(this.$element[0].children[0])[0].onload = () => {
                        this.$window.document.getElementById("cropToolLoading").style.display = "none";

                        this.imageTag = <HTMLImageElement>this.$window.document.getElementById("imageCropSource");
                        this.$scope.currentImageWidth = this.imageTag.offsetWidth;
                        this.$scope.currentImageHeight = this.imageTag.offsetHeight;

                        // Load the original image again (from the cache), so we can see what the original size is.
                        var originalImage = new Image();

                        originalImage.onload = (e:Event) => {
                            this.$scope.originalImageWidth = originalImage.width;
                            this.$scope.originalImageHeight = originalImage.height;

                            this.$scope.scaleFactor = originalImage.width / this.imageTag.offsetWidth;
                        };

                        originalImage.src = this.imageTag.src;
                    };
                }
            });

        }

        private registerImageValidatorOnElement() {
            // We need to make sure the image has loaded before we try and get the height.
            angular.element(this.$element[0].children[0])[0].onload = ()=> {
                this.$window.document.getElementById("cropToolLoading").style.display = "none";
                this.imageTag = <HTMLImageElement>this.$window.document.getElementById("imageCropSource");
                this.$scope.currentImageWidth = this.imageTag.offsetWidth;
                this.$scope.currentImageHeight = this.imageTag.offsetHeight;

                // Load the original image again (from the cache), so we can see what the original size is.
                var originalImage = new Image();

                originalImage.onload = () => {
                    this.$scope.originalImageWidth = originalImage.width;
                    this.$scope.originalImageHeight = originalImage.height;

                    this.$scope.scaleFactor = originalImage.width / this.imageTag.offsetWidth;

                };

                originalImage.src = this.imageTag.src;
            };
        }


        private registerInstantiateTranslateEvent() {
            this.imageCropSelectorDiv.addEventListener("mousedown", (e:MouseEvent)=> {
                this.startTranslation(e);
                this.focusedOnCrop = true;
            });
        }

        private registerInstantiateCropRectangle() {
            this.$element[0].children[2].addEventListener("mousedown", (e:MouseEvent)=> {
                e.preventDefault();
                this.mouseModifyingRectangle = true;
                this.focusedOnCrop = true;

                // All coordinates are relative to the parent container
                this.offset = e.srcElement.getBoundingClientRect();
                if (this.scrollLeft) {
                    this.originalMouseX = e.pageX - this.offset.left - this.scrollLeft;
                } else {
                    this.originalMouseX = e.pageX - this.offset.left;
                }

                if (this.scrollTop) {
                    this.originalMouseY = e.pageY - this.offset.top - this.scrollTop;
                } else {
                    this.originalMouseY = e.pageY - this.offset.top;
                }


            });
        }

        private registerMoveCropRecangleEvent() {
            this.$element[0].children[2].addEventListener("mousemove", (e:MouseEvent)=> {
                if (this.draggingRectangle) {
                    this.midTranslation(e);
                }
                if (this.mouseModifyingRectangle) {
                    this.offset = e.srcElement.getBoundingClientRect();
                    this.calculateMouseXRelative(e);
                    this.calculateMouseYRelative(e);

                    this.dragCorrectionX = 0;
                    this.dragCorrectionY = 0;
                    this.calculateRectangleDimensions(this.mouseXRelative, this.mouseYRelative, this.originalMouseX, this.originalMouseY);
                    this.drawRectangle();
                }

                if (this.resizingRectangle) {
                    this.midResizing(e);
                }
            });


            this.imageCropSelectorDiv.addEventListener("mousemove", (e:MouseEvent)=> {
                e.preventDefault();
                if (this.mouseModifyingRectangle) {
                    this.offset = this.$element[0].children[2].getBoundingClientRect();
                    this.calculateMouseXRelative(e);
                    this.calculateMouseYRelative(e);

                    this.calculateRectangleDimensions(this.mouseXRelative, this.mouseYRelative, this.originalMouseX, this.originalMouseY);
                    this.drawRectangle();
                }

                if (this.draggingRectangle) {
                    this.midTranslation(e);
                }

                if (this.resizingRectangle) {
                    this.midResizing(e);
                }
            });

            this.$element[0].children[2].addEventListener("mouseup", ()=> {
                this.resetInteractions();
            });

            this.imageCropSelectorDiv.addEventListener("mouseup", (e:MouseEvent)=> {
                this.originalDragX = 0;
                this.originalDragY = 0;
                e.preventDefault();
                this.resetInteractions();
            });

            angular.element(this.$window).on('mouseup', this.onMouseUpFunction);
            this.$scope.$on("$destroy", ()=> {
                angular.element(this.$window).off('scroll', this.onMouseUpFunction);
            });

            angular.element(this.$window).on('scroll', this.onScrollFunction);
            this.$scope.$on("$destroy", ()=> {
                angular.element(this.$window).off('scroll', this.onScrollFunction);
            });


            this.$element[0].children[2].addEventListener("mouseout", (e:MouseEvent) => {
                if (this.mouseModifyingRectangle) {
                    this.offset = e.srcElement.getBoundingClientRect();
                    this.calculateMouseXRelative(e);

                    if (this.mouseXRelative > this.$scope.currentImageWidth) {
                        this.mouseXRelative = angular.element(this.$element[0].children[0])[0].offsetWidth;
                    } else if (this.mouseXRelative < 0) {
                        this.mouseXRelative = 0;
                    }
                    this.calculateMouseYRelative(e);

                    if (this.mouseYRelative < 0) {
                        this.mouseYRelative = 0;
                    }


                    this.calculateRectangleDimensions(this.mouseXRelative, this.mouseYRelative, this.originalMouseX, this.originalMouseY);
                    this.drawRectangle();
                }
            });

            this.$element[0].children[2].addEventListener("dblclick", function () {
                if (!this.draggingRectangle && !this.resizingRectangle && !this.mouseModifyingRectangle) {
                    this.resetBackgroundColor();
                }
            });

        }


        private registerDiagonalScaling() {
            this.$window.document.getElementById("resize_top_left").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 0, this.diagonalScaling);
            });

            this.$window.document.getElementById("resize_top_right").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 1, this.diagonalScaling);
            });

            this.$window.document.getElementById("resize_bottom_right").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 2, this.diagonalScaling);
            });

            this.$window.document.getElementById("resize_bottom_left").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 3, this.diagonalScaling);
            });


            // Horizontal Scaling. Yay!
            this.$window.document.getElementById("resize_middle_left").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 0, this.horizontalScaling);
            });

            this.$window.document.getElementById("resize_left").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 0, this.horizontalScaling);
            });

            this.$window.document.getElementById("resize_middle_right").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 1, this.horizontalScaling);
            });

            this.$window.document.getElementById("resize_right").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 1, this.horizontalScaling);
            });


            // Vertical Scaling. Yay!
            this.$window.document.getElementById("resize_top_middle").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 0, this.verticalScaling);
            });

            this.$window.document.getElementById("resize_top").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 0, this.verticalScaling);
            });


            this.$window.document.getElementById("resize_bottom_middle").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 1, this.verticalScaling);
            });

            this.$window.document.getElementById("resize_bottom").addEventListener("mousedown", (e:MouseEvent) => {
                this.startResizing(e, 1, this.verticalScaling);
            });
        }


    }


    angular.module('richstudio.management').directive('imageCrop', ImageCropDirectiveFactory);

}