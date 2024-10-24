<div className="mt-6">
  {report.filesArray.length === 1 ? (
    // Single file (image/video) takes full width but limits the height
    report.filesArray[0].endsWith(".mp4") ? (
      <video
        src={report.filesArray[0]}
        controls
        className="rounded-lg shadow-sm w-full max-h-96 object-cover"
      />
    ) : (
      <img
        src={report.filesArray[0]}
        alt="Report file"
        className="rounded-lg shadow-sm w-full max-h-96 object-cover"
      />
    )
  ) : (
    // Multiple files (image/video) in grid
    <div className="grid grid-cols-2 gap-4">
      {report.filesArray.map((fileUrl, idx) =>
        fileUrl.endsWith(".mp4") ? (
          <video
            key={idx}
            src={fileUrl}
            controls
            className="rounded-lg shadow-sm w-full h-auto object-cover"
          />
        ) : (
          <img
            key={idx}
            src={fileUrl}
            alt={`Report file ${idx}`}
            className="rounded-lg shadow-sm w-full h-auto object-cover"
          />
        )
      )}
    </div>
  )}
</div>
