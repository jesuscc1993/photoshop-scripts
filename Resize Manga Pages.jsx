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
  var isJPG = /\.(jpg|jpeg)$/.test(file.name.toLowerCase());

  if (originalHeight > deviceHeight) {
    // resize files larger than the device dimensions
    var aspectRatio = originalWidth / originalHeight;
    var newHeight = deviceHeight;
    var newWidth = deviceHeight * aspectRatio;

    doc.resizeImage(newWidth, newHeight, undefined, ResampleMethod.BICUBIC);
  } else if (isJPG) {
    // skip files smaller or equal to the device dimensions that are already saved as JPG
    doc.close(SaveOptions.DONOTSAVECHANGES);
    return;
  }

  var jpgFile = new File(
    file.path +
      '/' +
      (isJPG ? file.name : file.name.replace(/\.[^\.]+$/, '') + '.jpg')
  );
  var jpgOptions = new JPEGSaveOptions();
  jpgOptions.quality = jpgQuality;

  doc.saveAs(jpgFile, jpgOptions, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);

  // delete the original file when not overwriting
  if (!isJPG && file.exists) {
    file.remove();
  }
}
