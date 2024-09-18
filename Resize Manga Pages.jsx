var imageExtensions = ['jpg', 'jpeg', 'png'];
var jpgQuality = 12;
var deviceHeight = 1200;

var parentFolder = Folder.selectDialog(
  'Select the folder containing your manga'
);
if (parentFolder != null) {
  processFolder(parentFolder);
}

function processFolder(folder) {
  var files = folder.getFiles();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file instanceof Folder) {
      processFolder(file);
    } else if (file instanceof File && isImageFile(file)) {
      processImage(file);
    }
  }
}

function isImageFile(file) {
  var fileExtension = file.name.toLowerCase().split('.').pop();
  return imageExtensions.includes(fileExtension);
}

function processImage(file) {
  var doc = open(file);

  var originalWidth = doc.width.as('px');
  var originalHeight = doc.height.as('px');

  if (originalHeight > deviceHeight) {
    var aspectRatio = originalWidth / originalHeight;
    var newHeight = deviceHeight;
    var newWidth = deviceHeight * aspectRatio;

    doc.resizeImage(newWidth, newHeight, undefined, ResampleMethod.BICUBIC);
  }

  var jpgFile = new File(
    file.path + '/' + file.name.replace(/\.[^\.]+$/, '') + '.jpg'
  );
  var jpgOptions = new JPEGSaveOptions();
  jpgOptions.quality = jpgQuality;

  doc.saveAs(jpgFile, jpgOptions, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);

  // delete the original file when not overwriting
  if (file.name.toLowerCase().indexOf('.jpg') === -1 && file.exists) {
    file.remove();
  }
}
