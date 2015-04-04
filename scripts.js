$(function () {
    function application() {
        var self = {};

        self.canvasElement = $(".drawing-canvas")[0];
        self.context = self.canvasElement.getContext("2d");
        self.canvasOffset = $(self.canvasElement).offset();
        self.image = null;


        self.init = function () {
            self.initSize();

            $(".fileinput-button").change(function (event) {
                self.fileUploaded(event.target.files[0]);
            });

            $(".scale-range, .rotate-range").on("input", function () {
                self.reDrawMeme();
            });

            $(".target-message-text").on("keyup", function () {
                self.reDrawMeme();
            });
        }

        self.initSize = function () {
            var parent = $(".drawing-canvas").parent();
            $(".drawing-canvas").attr("width", parent.width() - 5);
            $(".drawing-canvas").attr("height", parent.height() - 5);
        }

        self.fileUploaded = function (file) {
            self.image = new Image();
            self.image.src = URL.createObjectURL(file);
            $(self.image).load(function () {
                self.reDrawMeme();
            });
        }

        self.reDrawMeme = function () {
            var rotate = parseFloat($(".rotate-range").val());
            var scale = parseFloat($(".scale-range").val());
            var text = $(".target-message-text").val();

            self.context.save();
            self.context.clearRect(0, 0, self.canvasElement.width, self.canvasElement.height);

            // Translate to center so transformations will apply around this point
            self.context.translate(self.canvasElement.width / 2, self.canvasElement.height / 2);

            self.context.scale(scale, scale);

            var imageCenterX = self.image.width / 2;
            var imageCenterY = self.image.height / 2;
            var canvasCenterX = (self.canvasElement.width / 2);
            var canvasCenterY = (self.canvasElement.height / 2);
            var xImagePosition = canvasCenterX - imageCenterX;
            var yImagePosition = canvasCenterY - imageCenterY;

            //            var x = canvas.width / 2 - img.width / 2;
            //           var y = canvas.height / 2 - img.height / 2;

            //            ctx.translate(canvas5.width/2, canvas5.height/|>2);

            //            self.context.translate(imageCenterX, imageCenterY);
            self.context.rotate(Math.PI / 180 * (rotate));
            // Translate to center so transformations will apply around this point
            self.context.translate(-self.canvasElement.width / 2, -self.canvasElement.height / 2);
            self.context.drawImage(self.image, xImagePosition, yImagePosition);

            self.wrapText(
                self.context,
                text, self.canvasElement.width / 2,
                self.canvasElement.height - self.canvasElement.height / 4.5,
                self.canvasElement.width - self.canvasElement.width / 3,
                30);

            self.context.restore();
        }

        self.wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {

            ctx.font = '60pt Calibri';

            var words = text.split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.strokeText(line, x, y);
                    ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            ctx.lineWidth = 10;
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.strokeText(line, x, y);
            ctx.fillText(line, x, y);
        }

        self.init();
        return self;
    }

    window.app = new application();
});