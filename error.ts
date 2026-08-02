const requestedPath = path.resolve(uploadsDir, sanitizedFileName);
    if (!requestedPath.startsWith(uploadsDir + path.sep) && requestedPath !== uploadsDir) {
      return res.status(403).send("Access denied");
    }
