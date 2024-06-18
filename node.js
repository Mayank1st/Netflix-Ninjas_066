const crypto = require('crypto');

function uploadVideo(videoFile) {
  // Generate a unique hash for the video file
  const hash = crypto.createHash('md5').update(videoFile.data).digest('hex');
  const filename = `${hash}.${videoFile.name.split('.').pop()}`; // Append original extension

  // Store the video file (implementation depends on your storage solution)
  // ... (store video in desired location using filename)

  // Return the hashed filename
  return hash;
}

// Example usage in your upload route (replace with your logic)
app.post('/upload-video', (req, res) => {
  const videoFile = req.files.video;
  const hashedFilename = uploadVideo(videoFile);

  // Store hashed filename and other video info in db.json
  // ... (update db.json with hashedFilename and other details)

  res.json({ message: 'Video uploaded successfully!' });
});
