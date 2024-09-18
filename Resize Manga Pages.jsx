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
  return /\.(jpg|jpeg|png)$/.test(file.name.toLowerCase());
}

function processImage(file) {
  var doc = open(file);
  var originalHeight = doc.height.as('px');
  var originalWidth = doc.width.as('px');

  // skip file if smaller than device
  if (originalHeight >= deviceHeight) {
    doc.close(SaveOptions.DONOTSAVECHANGES);
    return;
  }

  var aspectRatio = originalWidth / originalHeight;
  var newHeight = deviceHeight;
  var newWidth = deviceHeight * aspectRatio;

  doc.resizeImage(newWidth, newHeight, undefined, ResampleMethod.BICUBIC);

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
